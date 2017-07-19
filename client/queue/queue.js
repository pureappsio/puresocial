Template.queue.helpers({

    queue: function() {
        return Queues.find({ userId: getUserId() }, { sort: { date: 1 } });
    }

});

Template.queue.events({

    'click #generate-queue': function() {

        // Store in DB
        Meteor.call('generateQueue', getUserId());

    },
    'click #auto-post': function() {

        // Store in DB
        Meteor.call('postingQueue', getUserId());

    }

});

Template.queue.rendered = function() {

    // Get time difference
    Session.set('timeDifference', Meteor.call('getTimeDifference', getUserId()));

}
