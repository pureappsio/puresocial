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

SyncedCron.config({
    log: false
});
