Meteor.methods({

    generateApiKey: function() {

        // Check if key exist
        if (!Meteor.user().apiKey) {

            // Generate key
            var key = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 16; i++) {
                key += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            console.log(key);

            // Update user
            Meteor.users.update(Meteor.user()._id, { $set: { apiKey: key } });
        }

    },

    isPixel: function() {

        if (Meteor.settings.facebookPixel) {
            return true;
        } else {
            return false;
        }

    },
    getPixel: function() {

        if (Meteor.settings.facebookPixel) {
            return Meteor.settings.facebookPixel;
        }

    },
    createUserAccount: function(data) {

        console.log(data);

        // Check if exist
        if (Meteor.users.findOne({ "emails.0.address": data.email })) {

            console.log('Updating existing user');
            var userId = Meteor.users.findOne({ "emails.0.address": data.email })._id;

        } else {

            console.log('Creating new user');

            // Create
            var userId = Accounts.createUser({
                email: data.email,
                password: data.password
            });

            // Assign role & teacher ID
            Meteor.users.update(userId, { $set: { role: data.role } });

        }

        return userId;

    },

    getAllActiveUsers: function() {

        var allUsers = Meteor.call('getAllUsers');
        var total = 0;

        for (var i = 0; i < allUsers.length; i++) {

            // Active user?
            var isUserActive = Meteor.call('isUserActive', allUsers[i]);
            if (isUserActive) { total = total + 1; }

        }
        return total;

    },
    isUserActive: function(user) {

        // Get today date
        var now = new Date();

        // Status
        status = false;

        // Check current size of queue
        var userQueue = Queues.find({ userId: user._id }).fetch();

        if (userQueue.length > 5) {
            status = true;
        }

        // End here
        return status;

    }

});
