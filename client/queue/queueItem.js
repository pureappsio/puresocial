Template.queueElement.helpers({

  formatDate: function(date) {
  	theDate = new Date(date);
  	localDate = new Date(theDate.toLocaleString());

  	return theDate.getDate() + '/' + (theDate.getMonth()+1) + '/' + theDate.getFullYear() + ' ' + theDate.getHours() + ':00';
  }

});

Template.queueElement.events({

  'click .post-queue': function(event, template) {
      
    // Store in DB
    Meteor.call('postQueueItem', template.data, Meteor.user(), function(error, data) {
      console.log("Posted");
    });

  }
});