Template.message.events({

   'click .delete': function() {

        // Store in DB
        Meteor.call('deleteMessage', this._id);
    }

});