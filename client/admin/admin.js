Template.admin.helpers({

  listAllUsers: function() {
    return Session.get('allUsers');
  },
  getTotalUsers: function() {
    return Session.get('totalUsers');
  },
  getTotalActiveUsers: function() {
    return Session.get('totalActiveUsers');
  },
  getActiveTotalRatio: function() {
    return (Session.get('totalActiveUsers')/Session.get('totalUsers')).toFixed(2);
  }
});

Template.admin.rendered = function() {

  // Get all users
  Meteor.call('getAllUsers', function(error, data) {
   Session.set('totalUsers', data.length);
   Session.set('allUsers', data);
  });

  // Get all users
  Meteor.call('getAllActiveUsers', function(error, data) {
   Session.set('totalActiveUsers', data);
  });
}

Template.admin.events({

  'click #update-twitter': function() {
    Meteor.call('getAccountsNames', Meteor.user());
  },
  'click #test': function() {
    Meteor.call('addSocialTag', 'Some text here with some link http://marcoschwartz.com/blog/stuff');
  },
  'click #update-social': function() {
    Meteor.call('updateSocialMediaNames', Meteor.user());
  }

});
