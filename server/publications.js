if (Meteor.isServer) {
    Meteor.publish("userData", function() {
        return Meteor.users.find({ _id: this.userId }, { services: { twitter: 1, facebook: 1 } });
    });

    Meteor.publish("allUsers", function() {
        return Meteor.users.find({});
    });

    Meteor.publish("userPosts", function() {
        return Posts.find({ userId: this.userId });
    });

    Meteor.publish("userQueue", function() {
        return Queues.find({ userId: this.userId });
    });

    Meteor.publish("userSchedule", function() {
        return Schedules.find({ userId: this.userId });
    });

    Meteor.publish("userSubscribers", function() {
        return Subscribers.find({ userId: this.userId });
    });

    Meteor.publish("userAudiences", function() {
        return Audiences.find({ userId: this.userId });
    });

     Meteor.publish("userMessengerQueues", function() {
        return MessengerQueues.find({ userId: this.userId });
    });

    Meteor.publish("userSequences", function() {
        return Sequences.find({ userId: this.userId });
    });

    Meteor.publish("userMessages", function() {
        return Messages.find({ userId: this.userId });
    });

    Meteor.publish("userServices", function() {
        return Services.find({ userId: this.userId });
    });

    Meteor.publish("userStats", function() {
        return Stats.find({ userId: this.userId });
    });

    Meteor.publish("userAutomations", function() {
        return Automations.find({ userId: this.userId });
    });

    Meteor.publish("userIntegrations", function() {
        return Integrations.find({ userId: this.userId });
    });

    Meteor.publish('files.images.all', function() {
        return Images.find().cursor;
    });
}
