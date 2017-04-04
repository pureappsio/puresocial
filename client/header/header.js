Template.header.events({

    'click #log-out': function() {
        Meteor.logout();
    }

});

Template.header.helpers({

    email: function() {
        return Meteor.user().emails[0].address;
    }

});
