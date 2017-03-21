Template.facebookPageItem.events({

	'click .delete': function(event, template) {
      
      // Store in DB
      Meteor.call('deleteFacebookPage', this._id);

    }

});