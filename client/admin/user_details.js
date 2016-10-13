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
    return Posts.find({userId: this._id}).fetch().length;
  },
  numberQueues: function() {
    return Queues.find({userId: this._id}).fetch().length;
  },
  numberAccounts: function() {
    accounts = 0;
    if (this.services.facebook) {
      accounts += this.services.facebook.length;
    }
    if (this.services.facebookPages) {
      accounts += this.services.facebookPages.length;
    }
    if (this.services.twitter) {
      accounts += this.services.twitter.length;
    }
    return accounts;
  }

});
