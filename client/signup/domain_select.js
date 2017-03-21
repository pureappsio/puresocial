Template.domainSelect.events({

    'click #select': function() {

        Meteor.call('setUserDomain', $('#domain').val(), function(err, data) {
            Router.go('/');
        });

    },
    'keydown #domain, keyup #domain': function() {

        Session.set('domainName', $('#domain').val())

    }

});

Template.domainSelect.helpers({

    domainName: function() {
        return Session.get('domainName');
    },
    domain: function() {
        
        var hostnameArray = document.location.hostname.split(".");

        if (hostnameArray.length == 3) {
            return hostnameArray[1] + hostnameArray[2];
        } else {
            return hostnameArray[0];
        }
    }

});
