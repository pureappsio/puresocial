// Post queues
SyncedCron.add({
    name: 'Post queues',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 1 minute');
    },
    job: function() {
        Meteor.call('postAllQueues');
    }
});

// Post queues
SyncedCron.add({
    name: 'Post messenger queues',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 10 seconds');
    },
    job: function() {
        Meteor.call('postMessengerQueues');
    }
});

// Stats
SyncedCron.add({
    name: 'Refresh stats',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 1 day');
    },
    job: function() {
        Meteor.call('refreshStats');
    }
});

SyncedCron.config({
    log: false
});
