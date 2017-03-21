import FacebookAPI from 'fbgraph';
FacebookAPI.setVersion("2.8");

import fs from 'fs';

Meteor.methods({

    userAddFacebookOauthCredentials: function(token, secret) {

        var service = Facebook.retrieveCredential(token, secret).serviceData;
        service.userId = Meteor.user()._id;
        service.type = 'facebook';

        console.log('Facebook account data: ');
        console.log(service);

        // Check if exists
        if (Services.findOne({ type: 'facebook', userId: Meteor.user()._id })) {

            console.log('Already existing Facebook data');

        } else {
            Services.insert(service);
        }

    },
    userAddFacebookPage: function(service) {

        service.userId = Meteor.user()._id;
        service.type = 'facebookPage';

        console.log(service);

        // Check if exists
        if (Services.findOne({ name: service.name, type: 'facebookPage', userId: Meteor.user()._id })) {

            console.log('Already existing Facebook Page data');

        } else {
            Services.insert(service);
        }

    },
    getFacebookPages: function() {

        // Find token
        var service = Services.findOne({ type: 'facebook', userId: Meteor.user()._id })
        var token = service.accessToken;

        console.log('Getting facebook Pages');

        // Get pages
        var pages = Async.runSync(function(done) {
            FacebookAPI.get("me/accounts?access_token=" + token, function(err, res) {

                if (err) { console.log(err); }
                console.log(res.data);
                done(null, res.data);
            });
        });

        return pages.result;

    },

    deleteFacebookPage: function(serviceId) {

        Services.remove(serviceId)

    },
    deleteFacebookAccount: function(serviceId) {

        // Update user profile
        Services.remove(serviceId)

    },
    postOnFacebook: function(post) {

        // Find token
        var service = Services.findOne(post.serviceId)
        var token = service.accessToken;

        console.log(token);

        // Add social tag
        post.content = Meteor.call('addSocialTag', post.content);

        // Post
        if (post.picture) {

            // Load picture
            console.log('Posting FB picture');

            // Post
            var pictureData = {
                url: post.picture,
                message: post.content
            };

            FacebookAPI.post('me/photos?access_token=' + token, pictureData, function(err, res) {

                // Returns the post id
                console.log(res); // { id: xxxxx}

            });

        } else {

            // Find link
            var isLinkPresent = Meteor.call('isLinkPresent', post.content);

            if (isLinkPresent) {
                var url = Meteor.call('linkify', post.content);

                // Post
                var wallPost = {
                    message: post.content,
                    link: url
                };
            } else {

                // Post
                var wallPost = {
                    message: post.content
                };

            }

            // Post on FB
            FacebookAPI.post("me/feed?access_token=" + token, wallPost, function(err, res) {
                // returns the post id
                console.log(res); // { id: xxxxx}
            });
        }

    },
    postOnFacebookPage: function(post) {

        // Get token and page ID        
        var service = Services.findOne(post.serviceId);
        var token = service.access_token;
        var pageId = service.id;

        console.log(service);

        // Add social tag
        post.content = Meteor.call('addSocialTag', post.content);

        // Image present ?
        if (post.picture) {

            // Load picture
            console.log('Posting FB picture');

            // Post
            var pictureData = {
                url: post.picture,
                message: post.content
            };

            FacebookAPI.post(pageId + "/photos?access_token=" + token, pictureData, function(err, res) {

                // Returns the post id
                if (err) { console.log(err); }
                console.log(res); // { id: xxxxx}

            });

        } else {

            // Find link
            var isLinkPresent = Meteor.call('isLinkPresent', post.content);

            if (isLinkPresent) {

                var url = Meteor.call('linkify', post.content);

                // Post
                var wallPost = {
                    message: post.content,
                    link: url
                };
            } else {

                // Post
                var wallPost = {
                    message: post.content
                };

            }

            // Post on FB
            FacebookAPI.post(pageId + "/feed?access_token=" + token, wallPost, function(err, res) {
                // returns the post id
                if (err) { console.log(err); }
                console.log(res); // { id: xxxxx}
            });
        }
    },

    isLinkPresent: function(variable) {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        var testUrl = variable.match(urlRegex);
        if (testUrl) {
            return true;
        } else {
            return false;
        }
    },

    linkify: function(variable) {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        var testUrl = variable.match(urlRegex);
        return testUrl[0];
    }

});
