Template.sequences.helpers({

    services: function() {
        return Services.find({ type: 'facebookPage', bot: 'on' });
    },
    sequences: function() {
        return Sequences.find({ serviceId: Session.get('serviceId') });
    },
    subscribers: function() {
        return Subscribers.find({ serviceId: Session.get('serviceId') }, { sort: { date: -1 } });
    }

});

Template.sequences.events({

    'click #service-id, change #service-id': function() {

        Session.set('serviceId', $('#service-id :selected').val());
        console.log(Session.get('serviceId'));

    },
    'click #create-sequence': function() {

        var sequence = {
            serviceId: $('#service-id :selected').val(),
            userId: Meteor.user()._id,
            name: $('#sequence-name').val()
        }

        Meteor.call('createSequence', sequence);

    },
    'click #assign-sequence': function() {

        Meteor.call('assignSequenceSubscriber', $('#subscriber-id :selected').val(), $('#sequence-id :selected').val());
    }

});
