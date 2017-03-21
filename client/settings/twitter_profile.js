Template.twitterProfile.events({

    'click .delete': function(event, template) {

        // Store in DB
        Meteor.call('deleteTwitterAccount', this._id);
    }

});
