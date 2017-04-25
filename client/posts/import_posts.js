Template.importPosts.helpers({

    contentIntegrations: function() {
        return Integrations.find({ type: 'purepress' });
    },
    socialMediaChoices: function() {
        return Services.find({});
    },
    getCategories: function() {
        return categories;
    },
    preview: function() {
        if (Session.get('prefix')) {
            return Session.get('prefix') + "Name of your article: http://urlofarticle.com"

        } else {
            return "Name of your article: http://urlofarticle.com"
        }
    }

});

Template.importPosts.events({

    'keyup #prefix': function() {
        Session.set('prefix', $('#prefix').val());
    },
    'click #import': function() {

        var media_data = $("input:checked");

        var media = [];
        for (var i = 0; i < media_data.length; i++) {

            media.push($(media_data[i]).attr("id"));

        }

        parameters = {
            integrationId: $('#integration :selected').val(),
            category: $('#category :selected').val(),
            media: media
        }

        if ($('#type :selected').val() != 'all') {
            parameters.type = $('#type :selected').val();
        }

        if (Session.get('prefix')) {
            parameters.prefix = Session.get('prefix');
        }

        Meteor.call('importPosts', parameters);
    }

});
