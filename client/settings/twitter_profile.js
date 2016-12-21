Template.twitterProfile.events({

	'click .delete': function(event, template) {
      
      // Store in DB
      Meteor.call('deleteTwitterAccount', template.data, function(error, data) {
        console.log("Deleted");
      });

    }

});