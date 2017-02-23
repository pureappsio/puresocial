Meteor.methods({

    stopOnboarding: function() {

        // Stop
        Meteor.users.update({ _id: Meteor.user()._id }, { $set: { "profile.onboarding": false } }, function(error) {
            if (error) { console.log(error); }
        });

    },
    deleteUser: function(id) {
      
        // Delete
        Meteor.users.remove(id);
    }

});
