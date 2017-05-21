Template.sequenceDetails.events({

    'click #create-message': function() {

        var message = Session.get('messageData');
        message.serviceId = this.serviceId;
        message.name = $('#message-name').val();
        message.delay = $('#delay :selected').val();
        message.delayType = $('#delay-type :selected').val();
        message.userId = Meteor.user()._id;
        message.sequenceId = this._id;

        Meteor.call('createMessage', message);

    }

});

Template.sequenceDetails.helpers({

    messages: function() {
        return Messages.find({ serviceId: this.serviceId, sequenceId: this._id });
    },
    numbers: function() {
        var numbers = [];

        for (i = 1; i < 23; i++) {
            numbers.push({number: i});
        }

        return numbers;
    }

});
