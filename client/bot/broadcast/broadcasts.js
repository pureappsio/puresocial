Template.broadcasts.helpers({

    services: function() {
        return Services.find({ type: 'facebookPage', bot: 'on' });
    },
    count: function() {
        return Subscribers.find({ serviceId: Session.get('serviceId') }).fetch().length;
    },
    subscribers: function() {
        return Subscribers.find({ serviceId: Session.get('serviceId') });
    }

});

Template.broadcasts.onRendered(function() {

});

Template.broadcasts.events({

    'click #service-id, change #service-id': function() {

        Session.set('serviceId', $('#service-id :selected').val());

    },
    'click #send-broadcast': function() {

        var message = Session.get('messageData');
        message.serviceId = $('#service-id :selected').val();
        message.userId = Meteor.user()._id;

        Meteor.call('sendMessengerBroadcast', message);

    },
    'click #send-test': function() {

        var message = Session.get('messageData');
        message.serviceId = $('#service-id :selected').val();
        message.messengerId = $('#test-user :selected').val();
        message.userId = Meteor.user()._id;

        Meteor.call('sendMessengerIndividual', message);

    }

});
