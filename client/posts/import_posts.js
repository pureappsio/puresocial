Template.importPosts.helpers({

    contentIntegrations: function() {
        return Integrations.find({ type: 'purepress' });
    },
    socialMediaChoices: function() {
        return Services.find({});
    },
    getCategories: function() {
        return categories;
    }

});

Template.importPosts.events({

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

        Meteor.call('importPosts', parameters);
    }

});
