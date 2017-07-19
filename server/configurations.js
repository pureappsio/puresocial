Meteor.startup(function() {

    ServiceConfiguration.configurations.remove({
        service: "twitter"
    });

    ServiceConfiguration.configurations.remove({
        service: "facebook"
    });

    ServiceConfiguration.configurations.remove({
        service: "pinterest"
    });

    ServiceConfiguration.configurations.remove({
        service: "instagram"
    });


    if (process.env.ROOT_URL == "http://localhost:3000/") {
        ServiceConfiguration.configurations.insert({
            service: "twitter",
            consumerKey: Meteor.settings.twitterLocal.consumer_key,
            secret: Meteor.settings.twitterLocal.consumer_secret
        });
    } else {
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
    } else {
        ServiceConfiguration.configurations.insert({
            service: "facebook",
            appId: Meteor.settings.facebookOnline.appId,
            secret: Meteor.settings.facebookOnline.secret
        });
    }

    ServiceConfiguration.configurations.insert({
        service: "pinterest",
        clientId: Meteor.settings.pinterest.appId,
        secret: Meteor.settings.pinterest.secret
    });

    ServiceConfiguration.configurations.insert({
        service: 'instagram',
        scope: ['basic', 'likes', 'relationships', 'comments', 'public_content'],
        clientId: Meteor.settings.instagram.clientId,
        secret: Meteor.settings.instagram.secret
    });

});
