import TwitterAPI from 'twitter';
import FacebookAPI from 'fbgraph';
import fs from 'fs';

Future = Npm.require('fibers/future');

Meteor.methods({

    retweetPost: function(tweetId, serviceId) {

        var service = Services.findOne(serviceId);
        var token = service.accessToken;
        var token_secret = service.accessTokenSecret;

        // Init client
        if (process.env.ROOT_URL == "http://localhost:3000/") {
            var client = new TwitterAPI({
                consumer_key: Meteor.settings.twitterLocal.consumer_key,
                consumer_secret: Meteor.settings.twitterLocal.consumer_secret,
                access_token_key: token,
                access_token_secret: token_secret
            });
        } else {
            var client = new TwitterAPI({
                consumer_key: Meteor.settings.twitterOnline.consumer_key,
                consumer_secret: Meteor.settings.twitterOnline.consumer_secret,
                access_token_key: token,
                access_token_secret: token_secret
            });
        }

        // Retweet
        client.post('statuses/retweet/' + tweetId, function(error, tweet, response) {
            if (error) throw error;
        });

    },
    userAddTwitterOauthCredentials: function(token, secret) {

        // Retrieve data
        var service = Twitter.retrieveCredential(token, secret).serviceData;

        // Get credentials
        var accountName = getUserCredentials(service.accessToken, service.accessTokenSecret);
        service.name = accountName;

        service.userId = Meteor.user()._id;
        service.type = 'twitter';

        console.log(service);

        // Check if exists
        if (Services.findOne({ id: service.id, type: 'twitter', userId: Meteor.user()._id })) {

            console.log('Already existing Twitter data');

        } else {
            Services.insert(service);
        }

    },
    deleteTwitterAccount: function(accountId) {

        // Update user profile
        Services.remove(accountId);

    },
    getTwitterFollowers: function(serviceId) {

        // Get data
        var service = Services.findOne(serviceId);
        var token = service.accessToken;
        var token_secret = service.accessTokenSecret;

        // Init client
        if (process.env.ROOT_URL == "http://localhost:3000/") {
            var client = new TwitterAPI({
                consumer_key: Meteor.settings.twitterLocal.consumer_key,
                consumer_secret: Meteor.settings.twitterLocal.consumer_secret,
                access_token_key: token,
                access_token_secret: token_secret
            });
        } else {
            var client = new TwitterAPI({
                consumer_key: Meteor.settings.twitterOnline.consumer_key,
                consumer_secret: Meteor.settings.twitterOnline.consumer_secret,
                access_token_key: token,
                access_token_secret: token_secret
            });
        }

        // Get followers
        var myFuture = new Future();
        client.get('followers/ids', function(error, tweet, response) {
            if (error) throw error;
            var result = JSON.parse(response.body);
            myFuture.return(result.ids.length);
        });

        return myFuture.wait();

    },
    postOnTwitter: function(post) {

        console.log('Posting on Twitter');

        // Add social tag
        post.content = Meteor.call('addSocialTag', post.content, 'twitter');

        // Switch ID for library ID
        if (post.libraryId) {
            post._id = post.libraryId;
        }

        // Replace link
        var isLinkPresent = Meteor.call('isLinkPresent', post.content);

        if (isLinkPresent) {

            var url = Meteor.call('linkify', post.content);
            var link = Meteor.call('shortenLink', post);

            // Replace URL
            post.content = (post.content).replace(url, link);

        }

        var service = Services.findOne(post.serviceId);
        var token = service.accessToken;
        var token_secret = service.accessTokenSecret;

        // Init client
        if (process.env.ROOT_URL == "http://localhost:3000/") {
            var client = new TwitterAPI({
                consumer_key: Meteor.settings.twitterLocal.consumer_key,
                consumer_secret: Meteor.settings.twitterLocal.consumer_secret,
                access_token_key: token,
                access_token_secret: token_secret
            });
        } else {
            var client = new TwitterAPI({
                consumer_key: Meteor.settings.twitterOnline.consumer_key,
                consumer_secret: Meteor.settings.twitterOnline.consumer_secret,
                access_token_key: token,
                access_token_secret: token_secret
            });
        }

        // Image present ?
        if (post.picture) {

            var imgUrl = Images.findOne(post.picture).versions.original.meta.pipeFrom;

            // Load picture
            var answer = HTTP.get(imgUrl, {
                encoding: null, // get content as binary data
                responseType: 'buffer' // get it as a buffer
            });

            // Post picture
            client.post('media/upload', { media: answer.content }, function(error, media, response) {

                if (error) { console.log(error); }
                if (!error) {

                    // If successful, a media object will be returned.
                    console.log(media);

                    // Lets tweet it
                    var status = {
                        status: post.content,
                        media_ids: media.media_id_string // Pass the media id string
                    }

                    client.post('statuses/update', status, function(error, tweet, response) {
                        if (!error) {
                            console.log(tweet);
                        }
                    });

                }
            });
        } else {

            // Post
            client.post('statuses/update', { status: post.content }, function(error, tweet, response) {
                if (error) throw error;
            });
        }
    }
});

function getUserCredentials(token, token_secret) {

    var fut = new Future();

    // Init client
    if (process.env.ROOT_URL == "http://localhost:3000/") {
        var client = new TwitterAPI({
            consumer_key: Meteor.settings.twitterLocal.consumer_key,
            consumer_secret: Meteor.settings.twitterLocal.consumer_secret,
            access_token_key: token,
            access_token_secret: token_secret
        });
    } else {
        var client = new TwitterAPI({
            consumer_key: Meteor.settings.twitterOnline.consumer_key,
            consumer_secret: Meteor.settings.twitterOnline.consumer_secret,
            access_token_key: token,
            access_token_secret: token_secret
        });
    }

    // Query account data
    client.get('account/verify_credentials', function(error, media, response) {

        // Return account data
        fut.return(JSON.parse(response.body).name);

    });

    return fut.wait();

}
