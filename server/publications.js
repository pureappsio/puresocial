if (Meteor.isServer) {

    Meteor.publish("userData", function() {
        return Meteor.users.find({}, { services: { twitter: 1, facebook: 1 } });
    });

    Meteor.publish("allUsers", function() {
        return Meteor.users.find({});
    });

    Meteor.publish("userPosts", function() {

        return Posts.find({});

    });

    Meteor.publish("userQueue", function() {
        return Queues.find({});
    });

    Meteor.publish("userSchedule", function() {
        return Schedules.find({});
    });

    Meteor.publish("userSubscribers", function() {
        return Subscribers.find({});
    });

    Meteor.publish("userAudiences", function() {
        return Audiences.find({});
    });

    Meteor.publish("userMessengerQueues", function() {
        return MessengerQueues.find({});
    });

    Meteor.publish("userSequences", function() {
        return Sequences.find({});
    });

    Meteor.publish("userMessages", function() {
        return Messages.find({});
    });

    Meteor.publish("userServices", function() {
        return Services.find({});
    });

    Meteor.publish("userStats", function() {
        return Stats.find({});
    });

    Meteor.publish("userAutomations", function() {
        return Automations.find({});
    });

    Meteor.publish("userIntegrations", function() {
        return Integrations.find({});
    });

    Meteor.publish('files.images.all', function() {
        return Images.find({}).cursor;
    });
}
