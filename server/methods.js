import TwitterAPI from 'twitter';
import FacebookAPI from 'fbgraph';
import fs from 'fs';

// Global variables
categories = [{ name: 'blogPosts' },
    { name: 'useOnce' },
    { name: 'promotion' }
];

Meteor.methods({

    
    shortenLink: function(post) {

        return Meteor.absoluteUrl() + 'link/' + post._id + '?service=' + post.serviceId;

    },
    validateApiKey: function(key) {

        var adminUser = Meteor.users.findOne({ apiKey: { $exists: true } });

        if (adminUser.apiKey == key) {
            return true;
        } else {
            return false;
        }

    },

    addSocialTag: function(content, type) {

        var urlRegex = /(https?:\/\/[^\s]+)/g;
        var url = content.match(urlRegex);
        content = content.replace(urlRegex, url + '?origin=social' + '&medium=' + type);

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

    saveNewPost: function(post) {

        // Build post object
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
        var result = Schedules.find({ userId: shedule.userId, category: schedule.category }).fetch();

        for (var i = 0; i < result.length; i++) {
            Schedules.remove(result[i]._id);
        }

        // Build post object
        console.log('Updating Schedule');

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
        Meteor.call('generateQueue', Meteor.user());

    },
    postNow: function(post) {

        console.log(post);

        // Post for each media
        for (i = 0; i < post.media.length; i++) {

            var service = Services.findOne(post.media[i]);
            post.serviceId = service._id;

            if (service.type == 'twitter') {
                Meteor.call('postOnTwitter', post);
            }
            if (service.type == 'facebookPage') {
                Meteor.call('postOnFacebookPage', post);
            }
            if (service.type == 'facebookGroup') {
                Meteor.call('postOnFacebookGroup', post);
            }
            if (service.type == 'pinterest') {
                Meteor.call('postPin', post);
            }
            if (service.type == 'facebook') {
                Meteor.call('postOnFacebook', post);
            }
        }

    }

});
