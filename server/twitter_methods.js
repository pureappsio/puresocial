import TwitterAPI from 'twitter';
import FacebookAPI from 'fbgraph';
import fs from 'fs';

Future = Npm.require('fibers/future');

Meteor.methods({

  retweetPost: function(tweetId, account, user) {

    // Find right token
    for (var j = 0; j < user.services.twitter.length; j++) {

      if (user.services.twitter[j].screenName == account) {

        var token = user.services.twitter[j].accessToken;
        var token_secret = user.services.twitter[j].accessTokenSecret;

      }
    }

    // Init client
    if (process.env.ROOT_URL == "http://localhost:3000/") {
      var client = new TwitterAPI({
        consumer_key: Meteor.settings.twitterLocal.consumer_key,
        consumer_secret: Meteor.settings.twitterLocal.consumer_secret,
        access_token_key: token,
        access_token_secret: token_secret
      });
    }
    else {
      var client = new TwitterAPI({
        consumer_key: Meteor.settings.twitterOnline.consumer_key,
        consumer_secret: Meteor.settings.twitterOnline.consumer_secret,
        access_token_key: token,
        access_token_secret: token_secret
      });
    }

    // Retweet
    client.post('statuses/retweet/' + tweetId,  function(error, tweet, response){
      if(error) throw error;
    });

  },
  getAccountsNames: function(user) {

    var accountNames = [];

    // Go through all user Twitter accounts
    twitterAccounts = user.services.twitter;
    for (var i = 0; i < twitterAccounts.length; i++) {

      // Token
      var twitterData = twitterAccounts[i];
      var token = twitterData.accessToken;
      var token_secret = twitterData.accessTokenSecret;

      var accountName = getUserCredentials(token, token_secret);
      console.log(accountName);
      twitterAccounts[i].name = accountName;

    }

    // Update
    Meteor.users.update({_id: user._id}, { $set: {"services.twitter": twitterAccounts} }, function(error) {
      if (error) {console.log(error);}
    });

  },
	userAddTwitterOauthCredentials: function(token, secret) {

    // Retrieve data
    var data = Twitter.retrieveCredential(token, secret).serviceData;
    console.log(data);

    // Get credentials
    var accountName = getUserCredentials(data.accessToken, data.accessTokenSecret);
    data.name = accountName;

    // Update user profile
    Meteor.users.update({_id: Meteor.user()._id}, { $push: {"services.twitter": data} }, function(error) {
      if (error) {console.log(error);}
    });

  },
  deleteTwitterAccount: function(account) {

  	// Update user profile
    Meteor.users.update({_id: Meteor.user()._id}, { $pull: {"services.twitter": account} }, function(error) {
      if (error) {console.log(error);}
    });

  },
  postOnTwitter: function(post, account, user) {

    console.log('Posting on Twitter');

    // Find right token
    for (var j = 0; j < user.services.twitter.length; j++) {

      if (user.services.twitter[j].screenName == account) {

        var token = user.services.twitter[j].accessToken;
        var token_secret = user.services.twitter[j].accessTokenSecret;

      }
    }

    // Init client
    if (process.env.ROOT_URL == "http://localhost:3000/") {
      var client = new TwitterAPI({
        consumer_key: Meteor.settings.twitterLocal.consumer_key,
        consumer_secret: Meteor.settings.twitterLocal.consumer_secret,
        access_token_key: token,
        access_token_secret: token_secret
      });
    }
    else {
      var client = new TwitterAPI({
        consumer_key: Meteor.settings.twitterOnline.consumer_key,
        consumer_secret: Meteor.settings.twitterOnline.consumer_secret,
        access_token_key: token,
        access_token_secret: token_secret
      });
    }

    // Image present ?
    if (post.picture) {

      // Load picture
      var answer = HTTP.get(post.picture, {
        encoding: null, // get content as binary data
        responseType: 'buffer' // get it as a buffer
      });

      // Post picture
      client.post('media/upload', {media: answer.content}, function(error, media, response){

        if (error) { console.log(error); }
        if (!error) {

        // If successful, a media object will be returned.
        console.log(media);

        // Lets tweet it
        var status = {
          status: post.content,
          media_ids: media.media_id_string // Pass the media id string
        }

        client.post('statuses/update', status, function(error, tweet, response){
          if (!error) {
            console.log(tweet);
          }
        });

        }
      });
    }

    else {

      // Post
      client.post('statuses/update', {status: post.content},  function(error, tweet, response){
        if(error) throw error;
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
    }
    else {
      var client = new TwitterAPI({
        consumer_key: Meteor.settings.twitterOnline.consumer_key,
        consumer_secret: Meteor.settings.twitterOnline.consumer_secret,
        access_token_key: token,
        access_token_secret: token_secret
      });
    }

    // Query account data
    client.get('account/verify_credentials', function(error, media, response){

      // Return account data
      fut.return(JSON.parse(response.body).name);

    });

    return fut.wait();

}
