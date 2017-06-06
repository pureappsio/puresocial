Template.settings.events({

    // 'click #update-tokens': function() {

    //     Meteor.call('updateFacebookPagesTokens');

    // },
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
    'click #link-facebook': function() {

        Facebook.requestCredential({ requestPermissions: ['read_insights', 'publish_pages', 'manage_pages'] }, function(token) {

            var secret = Package.oauth.OAuth._retrieveCredentialSecret(token);

            Meteor.call("userAddFacebookOauthCredentials", token, secret, function(err, response) {
                Meteor.call("getFacebookPages", function(err, response) {
                    Session.set('facebookPages', response);
                });
            });
        });
    }
});

Template.settings.helpers({

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
    getFacebookAccounts: function() {
        return Services.find({ type: 'facebook' });
    },
    getFacebookPages: function() {
        return Services.find({ type: 'facebookPage' });
    },
    key: function() {
        return Meteor.user().apiKey;
    }

});
