Template.bot.helpers({

    services: function() {
        return Services.find({ type: 'facebookPage', bot: 'on' });
    },
    automations: function() {
        return Automations.find({ serviceId: Session.get('serviceId') });
    }

});

Template.bot.events({

    'click #service-id, change #service-id': function() {

        Session.set('serviceId', $('#service-id :selected').val());

    },
    'click #add-automation': function() {

        var automation = {
            serviceId: $('#service-id :selected').val(),
            keywords: ($('#keywords').val()).split(','),
            message: $('#bot-text').val(),
            userId: Meteor.user()._id
        }

        console.log(automation);

        Meteor.call('addBotAutomation', automation);

    }

});

Template.bot.onRendered(function() {

    // // Init editor
    // CKEDITOR.replace('bot-text');

});
