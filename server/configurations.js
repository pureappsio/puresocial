Meteor.startup(function () {

  ServiceConfiguration.configurations.remove({
    service: "twitter"
  });

  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });
  
  if (process.env.ROOT_URL == "http://localhost:3000/") {
    ServiceConfiguration.configurations.insert({
      service: "twitter",
      consumerKey: Meteor.settings.twitterLocal.consumer_key,
      secret: Meteor.settings.twitterLocal.consumer_secret
    });  
  }
  else {
  	ServiceConfiguration.configurations.insert({
      service: "twitter",
      consumerKey: Meteor.settings.twitterOnline.consumer_key,
      secret: Meteor.settings.twitterOnline.consumer_secret
    });
  }

  if (process.env.ROOT_URL == "http://localhost:3000/") {
    ServiceConfiguration.configurations.insert({
      service: "facebook",
      appId: Meteor.settings.facebookLocal.appId,
      secret: Meteor.settings.facebookLocal.secret
    });  
  }
  else {
    ServiceConfiguration.configurations.insert({
      service: "facebook",
      appId: Meteor.settings.facebookOnline.appId,
      secret: Meteor.settings.facebookOnline.secret
    });
  }

});