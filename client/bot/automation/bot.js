Template.bot.helpers({

    services: function() {
        return Services.find({ type: 'facebookPage', bot: 'on' });
    },
    automations: function() {
        return Automations.find({ serviceId: Session.get('serviceId') });
    },
    sequences: function() {
        return Sequences.find({ serviceId: Session.get('serviceId') });
    }

});

Template.bot.events({

    'click #service-id, change #service-id': function() {

        Session.set('serviceId', $('#service-id :selected').val());

    },
    'click #add-automation': function() {

        // Automation
        var automation = {};
        automation.message = Session.get('messageData');
        automation.serviceId = $('#service-id :selected').val();
        automation.userId = Meteor.user()._id;
        automation.keywords = ($('#keywords').val()).split(',');

        // Action
        if ($('#action-type :selected').val() != 'noaction') {
            automation.action = {
                type: $('#action-type :selected').val(),
                parameter: $('#action-parameter :selected').val()
            }
        }

        // Add
        Meteor.call('addBotAutomation', automation);

    }

});

Template.bot.onRendered(function() {

    // // Init editor
    // CKEDITOR.replace('bot-text');

});
