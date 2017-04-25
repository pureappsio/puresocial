Template.automation.helpers({

    formatType: function() {
        if (this.type == 'welcomeMessage') {
            return 'Welcome Message';
        }
    },
    serviceName: function() {
        return Services.findOne(this.serviceId).name;
    }

});

Template.automation.events({

    'click .delete': function() {
        Meteor.call('deleteAutomation', this._id)
    },
    'keyup .keywords': function() {

        var automation = this;
        automation.keywords = ($('#keywords-' + this._id).val()).split(',');

        Meteor.call('editAutomation', automation)

    },
    'keyup .message': function() {

        var automation = this;
        automation.message = $('#message-' + this._id).val();

        Meteor.call('editAutomation', automation)

    }

});
