import FacebookAPI from 'fbgraph';
import fs from 'fs';

Meteor.methods({

    deleteFacebookPage: function(account) {

        // Update user profile
        Meteor.users.update({ _id: Meteor.user()._id }, { $pull: { "services.facebookPages": account } }, function(error) {
            if (error) { console.log(error); }
        });

    },
    deleteFacebookAccount: function(account) {

        // Update user profile
        Meteor.users.update({ _id: Meteor.user()._id }, { $pull: { "services.facebook": account } }, function(error) {
            if (error) { console.log(error); }
        });

    },
    postOnFacebook: function(post, user) {

        // Find token
        var token = user.services.facebook[0].accessToken;

        // Set token
        FacebookAPI.setAccessToken(token);

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

            FacebookAPI.post('me/photos', pictureData, function(err, res) {

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
            FacebookAPI.post("me/feed", wallPost, function(err, res) {
                // returns the post id
                console.log(res); // { id: xxxxx}
            });
        }

    },
    postOnFacebookPage: function(post, page, user) {

        // Find right token
        for (var j = 0; j < user.services.facebookPages.length; j++) {
            if (user.services.facebookPages[j].name == page) {
                var pageId = user.services.facebookPages[j].id;
                var token = user.services.facebookPages[j].access_token;
            }
        }

        // Set token
        FacebookAPI.setAccessToken(token);

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

            FacebookAPI.post(pageId + "/photos", pictureData, function(err, res) {

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
            FacebookAPI.post(pageId + "/feed", wallPost, function(err, res) {
                // returns the post id
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
