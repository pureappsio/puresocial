Template.facebookPageItem.events({

	'click .delete': function(event, template) {
      
      // Store in DB
      Meteor.call('deleteFacebookPage', template.data, function(error, data) {
        console.log("Deleted");
      });

    }

});