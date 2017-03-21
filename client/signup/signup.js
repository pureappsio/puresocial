Template.signup.events({

    'click #signup': function() {

        var data = {
            email: $('#email').val(),
            password: $('#password').val(),
            role: 'appuser'
        }

        Meteor.call('createUserAccount', data, function(err, data) {
            Meteor.loginWithPassword($('#email').val(), $('#password').val(), function(err, data) {
                Router.go('/');
            });
        });

    }

});
