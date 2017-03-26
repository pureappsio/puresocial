Template.broadcasts.helpers({

    services: function() {
        return Services.find({ type: 'facebookPage', bot: 'on' });
    },
    count: function() {
        return Subscribers.find({ serviceId: Session.get('serviceId') }).fetch().length;
    }

});

Template.broadcasts.events({

    'click #service-id, change #service-id': function() {

        Session.set('serviceId', $('#service-id :selected').val());

    },
    'click #send-broadcast': function() {

        var message = {
            serviceId: $('#service-id :selected').val(),
            message: $('#broadcast-text').val(),
            userId: Meteor.user()._id
        }

        Meteor.call('sendMessengerBroadcast', message);

    }

});
