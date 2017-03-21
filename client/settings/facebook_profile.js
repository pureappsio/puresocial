Template.facebookProfile.events({

    'click .delete': function(event, template) {

        // Store in DB
        Meteor.call('deleteFacebookAccount', this._id);
    }

});
