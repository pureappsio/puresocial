Template.facebookProfile.events({

	'click .delete': function(event, template) {
      
      // Store in DB
      Meteor.call('deleteFacebookAccount', template.data, function(error, data) {
        console.log("Deleted");
      });

    }

});