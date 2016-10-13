Template.queue.helpers({

  queue: function() {
  	return Queues.find({}, {sort: {date: 1}});
  }

});

Template.queue.events({

  'click #generate-queue': function() {

    // Store in DB
    Meteor.call('generateQueue', Meteor.user());
      
  },
  'click #auto-post': function() {

    // Store in DB
    Meteor.call('postingQueue', Meteor.user());
      
  }

});

Template.queue.rendered = function() {

  // Get time difference
  Session.set('timeDifference', Meteor.call('getTimeDifference', Meteor.user()));

}