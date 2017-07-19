Template.pinterestProfile.events({

    'click .delete': function(event, template) {

        // Store in DB
        Meteor.call('deletePinterestAccount', this._id);
    },
    'click .pinterest-action': function() {

        Meteor.call('getBoards', this._id);

    }

});
