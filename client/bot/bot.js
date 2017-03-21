Template.bot.helpers({

    services: function() {
        return Services.find({ type: 'facebookPage' });
    },
    welcomeMessages: function() {
        return Automations.find({ type: 'welcomeMessage' });
    }

});

Template.bot.events({

    'click #add-welcome': function() {

        var automation = {
            serviceId: $('#service-id :selected').val(),
            message: CKEDITOR.instances['welcome-text'].getData(),
            userId: Meteor.user()._id,
            type: 'welcomeMessage'
        }

        Meteor.call('addWelcomeBotMessage', automation);

    }

});

Template.bot.onRendered(function() {

    // Init editor
    CKEDITOR.replace('welcome-text');

});
