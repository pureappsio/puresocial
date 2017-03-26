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
    }

});
