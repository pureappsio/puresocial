import FacebookAPI from 'fbgraph';
FacebookAPI.setVersion("2.9");
Future = Npm.require('fibers/future');

import fs from 'fs';

Meteor.methods({

    getFacebookPageInsights: function(serviceId) {

        // Get service
        var service = Services.findOne(serviceId);
        var token = service.access_token;
        var pageId = service.id;

        console.log('Getting facebook data');

        var params = { metric: 'page_positive_feedback_by_type,page_impressions_unique,page_fan_adds_unique', period: 'week' };

        // Get pages
        var myFuture = new Future();
        FacebookAPI.get(pageId + "/insights?access_token=" + token, params, function(err, res) {

            if (err) { console.log(err); }
            console.log(res.data);
            myFuture.return(res.data);

        });

        return myFuture.wait();

    },

    getFacebookPageStat: function(serviceId) {

        // Get service
        var service = Services.findOne(serviceId);
        var token = service.access_token;
        var pageId = service.id;

        console.log('Getting facebook data');

        var params = { fields: "fan_count" };

        // Get pages
        var myFuture = new Future();
        FacebookAPI.get(pageId + "?access_token=" + token, params, function(err, res) {

            if (err) { console.log(err); }
            console.log(res);
            myFuture.return(res);
        });

        return myFuture.wait();

    },
    userAddFacebookOauthCredentials: function(token, secret) {

        var service = Facebook.retrieveCredential(token, secret).serviceData;
        service.userId = Meteor.user()._id;
        service.type = 'facebook';

        console.log('Facebook account data: ');
        console.log(service);

        // Check if exists
        if (Services.findOne({ type: 'facebook', userId: Meteor.user()._id })) {

            console.log('Already existing Facebook data');

            // Update token
            Services.update({
                type: 'facebook',
                userId: Meteor.user()._id
            }, { $set: { accessToken: service.accessToken } });

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
    userAddFacebookGroup: function(service) {

        service.userId = Meteor.user()._id;
        service.type = 'facebookGroup';

        console.log(service);

        // Check if exists
        if (Services.findOne({ name: service.name, type: 'facebookGroup', userId: Meteor.user()._id })) {

            console.log('Already existing Facebook Group data');

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

    getFacebookGroups: function() {

        // Find token
        var service = Services.findOne({ type: 'facebook', userId: Meteor.user()._id })
        var token = service.accessToken;

        console.log('Getting facebook groups');

        // Get groups
        var groups = Async.runSync(function(done) {
            FacebookAPI.get("me/groups?access_token=" + token, function(err, res) {

                if (err) { console.log(err); }
                console.log(res.data);
                done(null, res.data);

            });
        });

        return groups.result;

    },
    // getFacebookPagesGroups: function() {

    //     var groups = Meteor.call('getFacebookGroups');
    //     var pages = Meteor.call('getFacebookPages');

    // },
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

        // Switch ID for library ID
        if (post.libraryId) {
            post._id = post.libraryId;
        }

        // Add social tag
        post.content = Meteor.call('addSocialTag', post.content, 'facebook');

        // Find link
        var isLinkPresent = Meteor.call('isLinkPresent', post.content);

        if (isLinkPresent) {

            // var url = Meteor.call('linkify', post.content);

            var link = Meteor.call('shortenLink', post);

            // Post
            var wallPost = {
                message: post.content,
                link: link
            };

        } else {

            // Post
            var wallPost = {
                message: post.content
            };

        }

        // Image present ?
        if (post.picture) {

            // Load picture
            console.log('Posting FB picture');
            var imgUrl = Images.findOne(post.picture).versions.original.meta.pipeFrom;

            // Insert picture
            wallPost.picture = imgUrl;

        }

        console.log(wallPost);

        // Post on FB
        FacebookAPI.post("me/feed?access_token=" + token, wallPost, function(err, res) {
            // returns the post id
            console.log(res); // { id: xxxxx}
        });


    },
    postOnFacebookPage: function(post) {

        // Get token and page ID        
        var service = Services.findOne(post.serviceId);
        var token = service.access_token;
        var pageId = service.id;

        console.log(service);

        // Switch ID for library ID
        if (post.libraryId) {
            post._id = post.libraryId;
        }

        // Add social tag
        post.content = Meteor.call('addSocialTag', post.content, 'facebook');

        // Find link
        var isLinkPresent = Meteor.call('isLinkPresent', post.content);

        if (isLinkPresent) {

            // Get URL
            var url = Meteor.call('linkify', post.content);
            var link = Meteor.call('shortenLink', post);

            // Remove URL from message
            post.content = (post.content).replace(url, "");

            // Post
            var wallPost = {
                message: post.content,
                link: link
            };

        } else {

            // Post
            var wallPost = {
                message: post.content
            };

        }

        // Image present ?
        if (post.picture) {

            // Load picture
            console.log('Posting FB picture');
            var imgUrl = Images.findOne(post.picture).versions.original.meta.pipeFrom;

            // Insert picture
            wallPost.picture = imgUrl;

        }

        console.log(wallPost);

        // Post on FB
        FacebookAPI.post(pageId + "/feed?access_token=" + token, wallPost, function(err, res) {
            // returns the post id
            console.log(res); // { id: xxxxx}
        });
    },

    postOnFacebookGroup: function(post) {

        // Get token and page ID        
        var service = Services.findOne(post.serviceId);

        var facebookProfile = Services.findOne({ type: 'facebook', userId: service.userId });

        var token = facebookProfile.accessToken;
        var groupId = service.id;

        // Switch ID for library ID
        if (post.libraryId) {
            post._id = post.libraryId;
        }

        // Add social tag
        post.content = Meteor.call('addSocialTag', post.content, 'facebook');

        // Find link
        var isLinkPresent = Meteor.call('isLinkPresent', post.content);

        if (isLinkPresent) {

            // Get URL
            var url = Meteor.call('linkify', post.content);
            var link = Meteor.call('shortenLink', post);

            // Remove URL from message
            post.content = (post.content).replace(url, "");

            // Post
            var wallPost = {
                message: post.content,
                link: link
            };

        } else {

            // Post
            var wallPost = {
                message: post.content
            };

        }

        // Image present ?
        if (post.picture) {

            // Load picture
            console.log('Posting FB picture');
            var imgUrl = Images.findOne(post.picture).versions.original.meta.pipeFrom;

            // Insert picture
            wallPost.picture = imgUrl;

        }

        console.log(wallPost);

        // Post on FB
        var url = groupId + "/feed?access_token=" + token;
        console.log(url);

        FacebookAPI.post(url, wallPost, function(err, res) {
            // returns the post id
            console.log(res); // { id: xxxxx}
        });
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
