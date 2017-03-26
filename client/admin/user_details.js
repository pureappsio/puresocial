Template.userDetails.events({

    'click .delete': function() {
        Meteor.call('deleteUser', this._id);
    }

});

Template.userDetails.helpers({

    getEmail: function(userId) {
        return this.emails[0].address;
    },
    numberPosts: function() {
        return Posts.find({ userId: this._id }).fetch().length;
    },
    numberQueues: function() {
        return Queues.find({ userId: this._id }).fetch().length;
    },
    numberAccounts: function() {
        return Services.find({ userId: this._id }).fetch().length;
    }

});
