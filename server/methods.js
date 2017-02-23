import TwitterAPI from 'twitter';
import FacebookAPI from 'fbgraph';
import fs from 'fs';

// Global variables
categories = [{ name: 'blogPosts' },
    { name: 'useOnce' },
    { name: 'promotion' }
];

Meteor.methods({

    addSocialTag: function(content) {

        var urlRegex = /(https?:\/\/[^\s]+)/g;
        var url = content.match(urlRegex);
        content = content.replace(urlRegex, url + '?origin=social');

        return content;

    },
    updateSocialMediaNames: function(user) {

        // Go through all library posts
        var libraryItems = Posts.find({ userId: user._id }).fetch();

        for (i = 0; i < libraryItems.length; i++) {

            // Media
            currentMedia = libraryItems[i].media;

            for (j = 0; j < currentMedia.length; j++) {

                if (currentMedia[j].platform == 'Facebook Page' || currentMedia[j].platform == 'Facebook') {
                    currentMedia[j].displayName = currentMedia[j].userName;
                }
                if (currentMedia[j].platform == 'Twitter') {

                    // Look inside Twitter accounts
                    for (t = 0; t < user.services.twitter.length; t++) {
                        if (user.services.twitter[t].screenName == currentMedia[j].userName) {
                            currentMedia[j].displayName = user.services.twitter[t].name;
                        }
                    }

                }

            }

            // Update post
            var currentPost = libraryItems[i];
            var postId = currentPost._id;
            Posts.update({ _id: postId }, { $set: { "media": currentMedia } }, function(error) {
                if (error) { console.log(error); }
            });
        }

    },
    shortenUrl: function(url) {

        // Bitly token
        var token = Meteor.settings.bitlyToken;

        // Request
        var baseUrl = 'https://api-ssl.bitly.com'
        var request = '/v3/shorten?access_token=' + token + '&longUrl=' + url;
        var answer = HTTP.get(baseUrl + request);

        return JSON.parse(answer.content).data.url;

    },
    getAllUsers: function() {

        return Meteor.users.find({}).fetch();

    },
    saveUserTimezone: function(timezone) {

        console.log(timezone);

        Meteor.users.update({ _id: Meteor.user()._id }, { $set: { "profile.timezone": timezone } }, function(error) {
            if (error) { console.log(error); }
        });

    },
    userAddFacebookOauthCredentials: function(token, secret) {

        var data = Facebook.retrieveCredential(token, secret).serviceData;
        console.log(data);

        Meteor.users.update({ _id: Meteor.user()._id }, { $push: { "services.facebook": data } }, function(error) {
            if (error) { console.log(error); }
        });
    },
    userAddFacebookPage: function(data) {

        console.log(data);

        Meteor.users.update({ _id: Meteor.user()._id }, { $push: { "services.facebookPages": data } }, function(error) {
            if (error) { console.log(error); }
        });

    },
    getFacebookPages: function() {

        // Find token
        var token = Meteor.user().services.facebook[0].accessToken;

        // Set token
        FacebookAPI.setAccessToken(token);

        // Get pages
        var pages = Async.runSync(function(done) {
            FacebookAPI.get("me/accounts", function(err, res) {
                done(null, res.data);
            });
        });

        return pages.result;

    },
    updateFacebookPagesTokens: function() {

        // Find token
        var token = Meteor.user().services.facebook[0].accessToken;

        // Set token
        FacebookAPI.setAccessToken(token);

        // Get pages
        var pages = Async.runSync(function(done) {
            FacebookAPI.get("me/accounts", function(err, res) {
                done(null, res.data);
            });
        });

        var newPages = pages.result;
        var pages = Meteor.user().services.facebookPages;

        for (i in pages) {

            for (n in newPages) {
                if (newPages[n].id == pages[i].id) {
                   pages[i] = newPages[n];
                }
            }
        }

        // Update tokens
        Meteor.users.update(Meteor.user()._id, {$set: { "services.facebookPages": pages }})

    },
    saveNewPost: function(post) {

        // Build post object
        post.userId = Meteor.user()._id;
        post.submitted = new Date();
        console.log(post);

        // Save in DB
        var postId = Posts.insert(post);

        // Regenerate queue
        Meteor.call('generateQueue', Meteor.user());

    },
    updatePost: function(post) {

        // Build post object
        console.log('Updating Post');

        post.userId = Meteor.user()._id;
        post.submitted = new Date();
        console.log(post);

        // Save in DB
        Posts.update(post._id, { $set: post }, function(error) {
            console.log(error);
        });

        // Regenerate queue
        Meteor.call('generateQueue', Meteor.user());

    },
    getSchedule: function(category) {

        return Schedules.find({ userId: Meteor.user()._id, category: category }).fetch()[0];

    },
    updateSchedule: function(schedule) {

        // Remove existing schedule if already exist
        var result = Schedules.find({ userId: Meteor.user()._id, category: schedule.category }).fetch();

        for (var i = 0; i < result.length; i++) {
            Schedules.remove(result[i]._id);
        }

        // Build post object
        console.log('Updating Schedule');

        schedule.userId = Meteor.user()._id;
        schedule.submitted = new Date();

        // Save in DB
        Schedules.insert(schedule, function(error) {
            console.log(error);
        });

        // Regenerate queue
        Meteor.call('generateQueue', Meteor.user());

    },
    deletePost: function(post) {

        // Delete post
        Posts.remove(post._id);

        // Regenerate queue
        Meteor.call('generateQueue');

    },
    postNow: function(post) {

        console.log(post);

        // Post for each media
        for (i = 0; i < post.media.length; i++) {
            if (post.media[i].platform == 'Twitter') {
                Meteor.call('postOnTwitter', post, post.media[i].userName, Meteor.user());
            }
            if (post.media[i].platform == 'Facebook Page') {
                Meteor.call('postOnFacebookPage', post, post.media[i].userName, Meteor.user());
            }
            if (post.media[i].platform == 'Facebook') {
                Meteor.call('postOnFacebook', post, Meteor.user());
            }
        }

    }

});
