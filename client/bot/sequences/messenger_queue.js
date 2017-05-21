Template.messengerQueue.helpers({

    formatDate: function() {
        return moment(this.date).fromNow();
    },
    first_name: function() {
    	return Subscribers.findOne({messengerId: this.messengerId}).first_name;
    },
    last_name: function() {
    	return Subscribers.findOne({messengerId: this.messengerId}).last_name;
    }

});

Template.messengerQueue.events({

   'click .delete': function() {

        // Store in DB
        Meteor.call('deleteMessengerQueue', this._id);
    }

});