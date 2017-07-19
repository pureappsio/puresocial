Meteor.methods({

    refreshStats: function() {

        // Get users
        Meteor.users.find({ role: { $ne: 'teamuser' } }).fetch().forEach(function(user) {

            // Posting all queue items that needs to be posted
            console.log('Refreshing stats started for user: ' + user.username);

            // Posting queue for this user
            Meteor.call('refreshUserStats', user);

        });

    },
    refreshUserStats: function(user) {

        // Get services
        var services = Services.find({ userId: user._id }).fetch();

        // Refresh stats
        for (i in services) {

            // Get service
            var service = services[i];

            // Get number followers
            if (service.type == 'facebookPage') {
                var followers = Meteor.call('getFacebookPageStat', service._id);
                followers = followers.fan_count;
            }
            if (service.type == 'twitter') {
                var followers = Meteor.call('getTwitterFollowers', service._id);
            }
            if (service.type == 'instagram') {
                var followers = Meteor.call('getInstagramFollowers', service._id);
            }

            stat = {
                type: 'followers',
                value: followers,
                date: new Date(),
                serviceId: service._id,
                userId: user._id
            }

            console.log(stat);
            Stats.insert(stat);

            // Get page insights
            // if (service.type == 'facebookPage') {
            //     var insights = Meteor.call('getFacebookPageInsights', service._id);
            // } 

        }

    }

});
