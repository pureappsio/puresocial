import TwitterAPI from 'twitter';
import FacebookAPI from 'fbgraph';
import fs from 'fs';

Meteor.methods({

  postAllQueues: function() {

    // Get users
    Meteor.users.find({}).fetch().forEach(function(user) {

      // Posting all queue items that needs to be posted
      console.log('Auto-posting started for user: ' + user.username);

      // Posting queue for this user
      Meteor.call('postingQueue', user);

    });

  },
	postingQueue: function(user) {

    // Get next item from queue
    console.log('Getting next item from queue for user ' + user.username);
    var queue_items = Queues.find({userId: user._id}, {sort: {date: 1}}).fetch();

    // Create new queue in case it's empty
    if (queue_items.length == 0) {
      console.log('Generating new queue for user ' + user.username);
      Meteor.call('generateQueue', user);
      queue_items = Queues.find({userId: user._id}).fetch();
    }

    // Go through queue
    console.log('Going through queue for user ' + user.username);
    for (i = 0; i < queue_items.length; i++) {

      // Get item
      var queue_item = queue_items[i];

      // Get current time
      var currentDate = new Date();
      var currentTime = currentDate.getTime();
      var interval = 25;
      var difference = currentTime - queue_item.date.getTime();
      var difference = Math.floor(difference / (1000 * 60));

      //console.log('Time difference: ' + difference);

      // Something to do ?
      if ( difference > 0 && difference <= interval ) {

        // Post
        console.log('Posting now: ' + queue_item.content + ' for user: ' + user._id);
        Meteor.call('postQueueItem', queue_item, user);

      }
      else {
        console.log('Nothing to do for this post');
      }

    }
	},
  postQueueItem: function (queue_item, user) {

    // Which media?
    var mediaPlatform = queue_item.media[0].platform;
    var current_media_user = queue_item.media[0].userName;
    console.log('Posting on ' + mediaPlatform + ' for user ' + current_media_user);

    // Facebook profile
    if (mediaPlatform == 'Facebook') {

      // Post on Facebook
      Meteor.call('postOnFacebook', queue_item, user);

      // Remove from queue
      Queues.remove(queue_item._id);
      console.log('Removed item from queue');

      // Remove if use once category
      if (queue_item.category == 'useOnce') {
        Posts.remove(queue_item.libraryId);
      }

    }

    // Facebook pages
    if (mediaPlatform == 'Facebook Page') {

      // Post on Facebook
      Meteor.call('postOnFacebookPage', queue_item, current_media_user, user);

      // Remove from queue
      Queues.remove(queue_item._id);
      console.log('Removed item from queue');

      // Remove if use once category
      if (queue_item.category == 'useOnce') {
        Posts.remove(queue_item.libraryId);
      }

    }

    // Twitter
    if (mediaPlatform == 'Twitter') {

      // Post on Twitter
      Meteor.call('postOnTwitter', queue_item, current_media_user, user);

      // Remove from queue
      Queues.remove(queue_item._id);
      console.log('Removed item from queue');

      // Remove if use once category
      if (queue_item.category == 'useOnce') {
        Posts.remove(queue_item.libraryId);
      }

    }

  },
  getTimeDifference: function(user) {

    // Get difference
    var serverTimezone = new Date().getTimezoneOffset() / 60;
    if (user.profile.timezone) {
      var userTimeZone = user.profile.timezone;
    }
    else {
      var userTimeZone = serverTimezone;
    }
    var timeDifference = userTimeZone + serverTimezone;
    return timeDifference;

  },
  adjustQueueTimezone: function(user) {

    // Get time difference
    var timeDifference = Meteor.call('getTimeDifference', user);

    // Get queues from this user
    var queues = Queues.find({userId: user._id}).fetch();

    // Delete queues for this user
    Queues.remove({userId: user._id});

    // Modify queues
    for (i = 0; i < queues.length; i++) {

      // Get date
      var currentDate = queues[i].date;
      queues[i].displayedDate = new Date(currentDate);

      // Adjust date
      currentDate.setTime(currentDate.getTime() - (timeDifference*60*60*1000));
      queues[i].date = currentDate;
      Queues.insert(queues[i]);

    }

  },
  generateQueue: function(user) {

	// Delete queues for this user
	Queues.remove({userId: user._id});

  // Create queue
  queueLength = 0;

  // Get schedules for user
  var schedules = Schedules.find({userId: user._id}).fetch();

  // Get all posts from user
  var posts = Posts.find({userId: user._id}).fetch();

  // If no posts or schedules defined, stop here
  if (schedules.length == 0 || posts.length == 0) {
    console.log('No posts or schedule for user ' + user.username);
  }
  else {

    // Shuffle them
    posts = shuffle(posts);

    // Add more if needed
    var orginalPosts = posts.slice();
    while (posts.length < 10) {
      for (var i = 0; i < orginalPosts.length; i++) {
        posts.push(orginalPosts[i]);
      }
    }

    // Decompose posts by media
    var decomposedPosts = decomposePostsMedia(posts);
    // console.log('Decomposed posts: ');
    // console.log(decomposedPosts);

    // Make list of all media
    var mediaList = listAllMedia(decomposedPosts);

    // Repeat for all media
    for (var k = 0; k < mediaList.length; k++) {

      console.log('Current Media: ' + mediaList[k].userName);

      // Build categories schedules
      reference_schedule = genCatSchedule(schedules);

      // Copy a temporary schedule
      temporary_schedule = genCatSchedule(schedules);

      // Go through all posts
      for (var i = 0; i < decomposedPosts.length; i++) {

        // Check if it is the correct media
        if (mediaList[k].platform == decomposedPosts[i].media[0].platform && mediaList[k].userName == decomposedPosts[i].media[0].userName) {

          //console.log('Match');

          // Get category
          var category = decomposedPosts[i].category;

          // Get item
          var queue_item = {};

          queue_item.libraryId = decomposedPosts[i]._id;
          queue_item.userId = decomposedPosts[i].userId;
          queue_item.content = decomposedPosts[i].content;
          queue_item.category = decomposedPosts[i].category;
          queue_item.media = decomposedPosts[i].media;
          if (decomposedPosts[i].picture) {
            queue_item.picture = decomposedPosts[i].picture;
          }

          //console.log(queue_item);

          // Get next date for this category, or regenerate array
          if (temporary_schedule[category].dates.length == 0) {
            //console.log('Resetting schedule');
            reference_schedule = genCatSchedule(schedules);
            temporary_schedule[category].dates = reference_schedule[category].dates;
            temporary_schedule[category].shift = 7;
          }
          var date_item = temporary_schedule[category].dates.shift();

        // Build date for current post
        var theDate = temporary_schedule[category].previousDate;
        //console.log('Date at start: ' + theDate);

        // Set time
        if (date_item.period == 'AM') {
          theDate.setHours(parseInt(date_item.hour));
        }
        if (date_item.period == 'PM') {
          theDate.setHours(parseInt(date_item.hour) + 12);
        }
        theDate.setMinutes(0);
        theDate.setSeconds(0);

        // Get previous day for category
        var previousDate = temporary_schedule[category].previousDate;

        // Calculate new day
        var dayNumber = getDayNumber(date_item.day);

        // Set day
        var previousDay = previousDate.getDay();
        var difference = dayNumber - previousDay;
        if (difference < 0) {
          difference = difference + 7;
        }
        //console.log('Day difference: ' + difference);

        if (temporary_schedule[category].shift == 7) {
          difference = difference + 7;
          temporary_schedule[category].shift = 0;
        }

        var newDay = previousDate.getDate() + difference;

        theDate.setDate(newDay);

        // Set previous date
        temporary_schedule[category].previousDate = theDate;
        //console.log('temporary_schedule date: ' + temporary_schedule[category].previousDate);

        // Set new date
        queue_item.date = theDate;
        //console.log('Final date: ' + theDate);

        // Put in queue
        var today = new Date();
        //console.log(theDate);

        if (theDate.getDate() > today.getDate() || (theDate.getMonth() > today.getMonth()) ) {

          // Add to queue
          if (queue_item.category == 'useOnce') {

            if (notInQueue(queue_item, user)) {
              console.log('Adding to queue: ')
              console.log(queue_item);
              var queueId = Queues.insert(queue_item);
            }

          }
          else {
            var queueId = Queues.insert(queue_item);
          }


        }

        if ((theDate.getDate() == today.getDate())) {

          // Add to queue
          if (queue_item.category == 'useOnce') {

            if (notInQueue(queue_item, user)) {
              console.log(queue_item);
              var queueId = Queues.insert(queue_item);
            }

          }
          else {
            var queueId = Queues.insert(queue_item);
          }

        }

        }

      }

    }

    // Adjust queues for user timezone
    Meteor.call('adjustQueueTimezone', user);

  }

	}
});

function notInQueue(item, user) {

  // Get all queue elements for user
  var queue = Queues.find({userId: user._id}).fetch();

  var notInQueue = true;

  for (i = 0; i < queue.length; i++) {
    if ((queue[i].content == item.content) && (queue[i].media[0].platform == item.media[0].platform)) {
      notInQueue = false;
    }
  }

  return notInQueue;

}

function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function getDayNumber(dayString) {

  var dayNumber = 0;
  if (dayString == 'Monday') {
    dayNumber = 1;
  }
  if (dayString == 'Tuesday') {
    dayNumber = 2;
  }
  if (dayString == 'Wednesday') {
    dayNumber = 3;
  }
  if (dayString == 'Thursday') {
    dayNumber = 4;
  }
  if (dayString == 'Friday') {
    dayNumber = 5;
  }
  if (dayString == 'Saturday') {
    dayNumber = 6;
  }
  if (dayString == 'Sunday') {
    dayNumber = 0;
  }

  return dayNumber;
}

function getDayString(dayNumber) {

  var dayString = '';

  if (dayNumber == 0) {
    dayString = 'Sunday';
  }
  if (dayNumber == 1) {
    dayString = 'Monday';
  }
  if (dayNumber == 2) {
    dayString = 'Tuesday';
  }
  if (dayNumber == 3) {
    dayString = 'Wednesday';
  }
  if (dayNumber == 4) {
    dayString = 'Thursday';
  }
  if (dayNumber == 5) {
    dayString = 'Friday';
  }
  if (dayNumber == 6) {
    dayString = 'Saturday';
  }

  return dayString;
}

function genCatSchedule(schedules) {

  var reference_schedule = {};

    for (var i = 0; i < schedules.length; i++) {

      var category_schedule = {};

      // Go through all days
      var category_dates = [];

      // Reorganise days from schedule according to today
      //console.log(schedules[i].days);
      var today = new Date();
      var todayDay = today.getDay();

      tempWeekDays = weekDays.slice();
      rotate(tempWeekDays, todayDay);

      var orderedSchedule = [];
      for (d = 0; d < tempWeekDays.length; d++) {
        if ((schedules[i].days).indexOf(tempWeekDays[d]) > -1 ) {
          orderedSchedule.push(tempWeekDays[d]);
        }
      }
      //console.log(orderedSchedule);

      for (var j = 0; j < schedules[i].days.length; j++) {

        var category_date = {};
        category_date.day = orderedSchedule[j];
        category_date.hour = schedules[i].hour;
        category_date.period = schedules[i].period;

        category_dates.push(category_date);

      }
      var category_element = {};
      category_element.dates = category_dates;

      var today = new Date();
      category_element.previousDate = today;
      category_element.shift = 0;
      reference_schedule[schedules[i].category] = category_element;

    }
    return reference_schedule;

}

function decomposePostsMedia(posts) {

  var decomposed = [];

  for (var i = 0; i < posts.length; i++) {

    for (var j = 0; j < posts[i].media.length; j++) {

      var newPost = {};

    newPost._id = posts[i]._id;
	  newPost.userId = posts[i].userId;
	  newPost.content = posts[i].content;
	  newPost.category = posts[i].category;
    if (posts[i].picture) {
      newPost.picture = posts[i].picture;
    }

	  newPost.media = posts[i].media;

      newPost.media = [posts[i].media[j]];
      decomposed.push(newPost);

    }

  }

  return decomposed;
}

function listAllMedia(posts) {

  var mediaList = [];

  for (var i = 0; i < posts.length; i++) {

  	var media = posts[i].media[0];

  	var unique = true;
  	for (var j = 0; j < mediaList.length; j++) {
  		if (mediaList[j].platform == media.platform && mediaList[j].userName == media.userName) {unique = false;}
  	}
  	if (unique) {mediaList.push(media);}

  }

  return mediaList;
}

function sortByMedia(posts) {

  // Decompose
  var decomposedPosts = decomposePostsMedia(posts);

  // Find all media
  mediaList = listAllMedia(decomposedPosts);

  // Sort
  var sortedPosts = {};
  for (i = 0; i < mediaList.length; i++) {
    sortedPosts[mediaList[i]] = [];

    for (j = 0; j < decomposedPosts.length; j++) {
      if (mediaList[i] == decomposedPosts[j].media[0]) {
      	sortedPosts[mediaList[i]].push(decomposedPosts[j]);
      }
    }
  }

  return sortedPost;
}

var weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

function rotate( array , times ){
  while( times-- ){
    var temp = array.shift();
    array.push( temp )
  }
}
