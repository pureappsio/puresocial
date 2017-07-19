Template.addFacebookPage.rendered = function() {

    if (Services.findOne({ type: 'facebook' })) {
        Meteor.call("getFacebookPages", function(err, response) {
            console.log(response);
            Session.set('facebookPages', response);
        });

        Meteor.call("getFacebookGroups", function(err, response) {
            console.log(response);
            Session.set('facebookGroups', response);
        });
    }

};

Template.addFacebookPage.helpers({

    selectFacebookPages: function() {
        if (Services.findOne({ type: 'facebook' })) {
            return Session.get('facebookPages');
        }
    },

    selectFacebookGroups: function() {
        if (Services.findOne({ type: 'facebook' })) {
            return Session.get('facebookGroups');
        }
    }

});
