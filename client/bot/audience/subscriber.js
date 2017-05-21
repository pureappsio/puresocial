Template.subscriber.events({

    'click .delete': function() {

        // Store in DB
        Meteor.call('deleteSubscriber', this._id);
    }

});

Template.subscriber.helpers({

    formatDate: function() {

        return moment(this.date).fromNow();
    }

});
