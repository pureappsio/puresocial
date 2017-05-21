Template.messageSubscriber.events({

    'click #send-message': function() {

        var message = Session.get('messageData');
        message.serviceId = this.serviceId;
        message.messengerId = this.messengerId;
        message.userId = Meteor.user()._id;

        Meteor.call('sendMessengerIndividual', message);

    }

});