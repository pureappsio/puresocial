Meteor.methods({

  getAllActiveUsers: function() {

    var allUsers = Meteor.call('getAllUsers');
    var total = 0;

    for (var i = 0; i < allUsers.length; i++) {

      // Active user?
      var isUserActive = Meteor.call('isUserActive', allUsers[i]);
      if (isUserActive) {total = total + 1;}

    }
    return total;

  },
  isUserActive: function(user) {

    // Get today date
    var now = new Date();

    // Status
    status = false;

    // Check current size of queue
    var userQueue = Queues.find({userId: user._id}).fetch();

    if (userQueue.length > 5) {
      status = true;
    }

    // End here
    return status;

  }

});
