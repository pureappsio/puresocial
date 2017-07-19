Template.facebookGroupItem.events({

    'click .delete': function() {

        // Store in DB
        Meteor.call('deleteFacebookPage', this._id);

    }

});
