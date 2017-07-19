Future = Npm.require('fibers/future');

Meteor.methods({

    getInstagramFollowers: function(serviceId) {

        var data = Meteor.call('getProfileData', serviceId);

        return data.counts.followed_by;

    },
    tagSearch: function(query) {

        // Get token
        var service = Services.findOne({ type: 'instagram' });

        // Request
        var result = HTTP.get('https://api.instagram.com/v1/tags/search?q=' + query + '&access_token=' + service.accessToken);

        console.log(result.data.data);

        return result.data.data;

    },
    mediaTagSearch: function(tag) {

        // Get token
        var service = Services.findOne({ type: 'instagram' });

        // Request
        var result = HTTP.get('https://api.instagram.com/v1/tags/' + tag +'/media/recent?access_token=' + service.accessToken);

        console.log(result.data.data);

        return result.data.data;

    },
    getProfileData: function(serviceId) {

        // Get token
        var service = Services.findOne(serviceId);

        // Request
        var result = HTTP.get('https://api.instagram.com/v1/users/self/?access_token=' + service.accessToken);

        return result.data.data;
    },
    deleteInstagramAccount: function(serviceId) {

        Services.remove(serviceId);

    },
    userAddInstagramOauthCredentials: function(token, secret) {

        // Retrieve data
        var service = Instagram.retrieveCredential(token, secret).serviceData;

        service.userId = Meteor.user()._id;
        service.type = 'instagram';

        console.log(service);

        service.name = service.full_name;

        // Check if exists
        if (Services.findOne({ id: service.id, type: 'instagram', userId: Meteor.user()._id })) {

            console.log('Already existing Instagram data');

        } else {
            Services.insert(service);
        }

    },

});
