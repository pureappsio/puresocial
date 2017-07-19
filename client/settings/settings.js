Template.settings.events({

    // 'click #update-tokens': function() {

    //     Meteor.call('updateFacebookPagesTokens');

    // },

    'click #add-user': function() {

        var user = {
            email: $("#user-email").val(),
            password: $("#user-password").val(),
            userId: Meteor.user()._id
        };

        Meteor.call('addTeamUser', user);

    },
    'click #generate-key': function() {

        Meteor.call('generateApiKey');

    },
    'click #add-integration': function() {

        var accountData = {
            type: $('#integration-type :selected').val(),
            key: $('#integration-key').val(),
            url: $('#integration-url').val(),
            userId: Meteor.user()._id
        };
        Meteor.call('addIntegration', accountData);

    },
    'click #save-timezone': function() {

        // Get user choice
        var timezone = $('#timezone').find(":selected").val();
        timezone = parseInt(timezone);

        // Save it
        Meteor.call("saveUserTimezone", timezone, function(err, response) {
            if (!err) { console.log('Timezone'); }
        });

    },
    'click #link-twitter': function() {

        Twitter.requestCredential({ requestPermissions: [] }, function(token) {

            var secret = Package.oauth.OAuth._retrieveCredentialSecret(token);

            Meteor.call("userAddTwitterOauthCredentials", token, secret, function(err, response) {
                console.log('Token saved');
            });
        });

    },
    'click #link-pinterest': function() {

        Pinterest.requestCredential({ requestPermissions: [] }, function(token) {

            var secret = Package.oauth.OAuth._retrieveCredentialSecret(token);

            Meteor.call("userAddPinterestOauthCredentials", token, secret, function(err, response) {
                console.log('Token saved');
            });
        });

    },
    'click #link-instagram': function() {

        Instagram.requestCredential({ requestPermissions: ['public_content'] }, function(token) {

            var secret = Package.oauth.OAuth._retrieveCredentialSecret(token);

            Meteor.call("userAddInstagramOauthCredentials", token, secret, function(err, response) {
                console.log('Token saved');
            });
        });

    },
    'click #link-facebook': function() {

        Facebook.requestCredential({ requestPermissions: ['publish_actions', 'read_insights', 'publish_pages', 'manage_pages', 'user_managed_groups'] }, function(token) {

            var secret = Package.oauth.OAuth._retrieveCredentialSecret(token);

            Meteor.call("userAddFacebookOauthCredentials", token, secret, function(err, response) {
                Meteor.call("getFacebookPages", function(err, response) {
                    Session.set('facebookPages', response);
                });

                Meteor.call("getFacebookGroups", function(err, response) {
                    Session.set('facebookGroups', response);
                });
            });
        });
    }
});

Template.settings.helpers({

    teamUsers: function() {

        return Meteor.users.find({ role: 'teamuser', appUserId: Meteor.user()._id }).fetch();

    },
    integrations: function() {
        return Integrations.find({});
    },

    isFacebookLinked: function() {
        if (Services.findOne({ type: 'facebook' })) {
            return '';
        } else {
            return 'disabled';
        }
    },
    plan: function() {
        if (Meteor.user().profile.plan) {
            if (Meteor.user().profile.plan == 'free') {
                return "FREE";
            }
        } else {
            return "FREE";
        }
    },
    getUserData: function() {
        console.log(Meteor.user());
    },
    getTwitterAccounts: function() {
        return Services.find({ type: 'twitter' });
    },
    getPinterestAccounts: function() {
        return Services.find({ type: 'pinterest' });
    },
    getInstagramAccounts: function() {
        return Services.find({ type: 'instagram' });
    },
    getFacebookAccounts: function() {
        return Services.find({ type: 'facebook' });
    },
    getFacebookPages: function() {
        return Services.find({ type: 'facebookPage' });
    },
    getFacebookGroups: function() {
        return Services.find({ type: 'facebookGroup' });
    },
    key: function() {
        return Meteor.user().apiKey;
    }

});
