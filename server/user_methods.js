Meteor.methods({

  stopOnboarding: function() {

    // Stop
    Meteor.users.update({_id: Meteor.user()._id}, { $set: {"profile.onboarding": false} }, function(error) {
      if (error) {console.log(error);}
    });

  },
  deleteUser: function(id) {
    // Delete
    Meteor.users.remove(id);
  },
  sendReminders: function() {

    // Get all users
    var allUsers = Meteor.call('getAllUsers');

    // Go through users
    for (var i = 0; i < allUsers.length; i++) {

      // Active user?
      var isUserActive = Meteor.call('isUserActive', allUsers[i]);

      // Reset reminder for active users
      if (isUserActive) {
        Meteor.users.update({_id: Meteor.user()._id}, { $push: {"profile.reminderSent": false} }, function(error) {
          if (error) {console.log(error);}
        });
      }

      else if (!isUserActive && !allUsers[i].profile.reminderSent) {

        // Calculate date difference
        var creationDate = new Date(allUsers[i].createdAt);
        var today = new Date();
        var dateDifference = today.getTime() - creationDate.getTime();

        if (dateDifference > 15 * 24 * 60 * 60 * 1000) {

          console.log('Send reminder email to: ' + allUsers[i].username);

          // Send email
          SSR.compileTemplate('reminderEmail', Assets.getText( 'reminder_email.html' ) );
          Email.send({
            to: allUsers[i].emails[0].address,
            from: "SocialGear <contact@socialgear.io>",
            subject: "Just checking on you",
            html: SSR.render('reminderEmail')
          });

          // Put reminder as sent for this user
          Meteor.users.update({_id: Meteor.user()._id}, { $push: {"profile.reminderSent": true} }, function(error) {
            if (error) {console.log(error);}
          });
        }
      }

    }

  }

});
