Template.instagramProfile.events({

    'click .delete': function(event, template) {

        // Store in DB
        Meteor.call('deleteInstagramAccount', this._id);

    },
    'click .instagram-action': function() {

        Meteor.call('getProfileData', this._id);

    }

});
