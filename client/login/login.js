Template.login.events({

    'click #login': function() {

        Meteor.loginWithPassword($('#email').val(), $('#password').val(), function() {

            Router.go('/');

        });

    }

});
