Template.integration.events({

    'click .delete-integration': function() {
        Meteor.call('removeIntegration', this._id);
    }

});

Template.integration.helpers({

    list: function() {
        if (this.list) {
            return '[Connected to email list]';
        } else {
            return '';
        }
    }

});
