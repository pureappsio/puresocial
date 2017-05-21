Template.library.helpers({

    posts: function() {

        var query = {};

        if (Session.get('categoryFilter')) {
            if (Session.get('categoryFilter') != 'all') {
                query.category = Session.get('categoryFilter');
            }
        }

        if (Session.get('serviceFilter')) {
            if (Session.get('serviceFilter') != 'all') {
                query.media = Session.get('serviceFilter');
            }
        }

        console.log(query);

        console.log(Posts.find(query).fetch());

        return Posts.find(query);
    },
    getCategories: function() {
        return categories;
    },
    socialMediaChoices: function() {

        return Services.find({});

    }

});

Template.library.rendered = function() {

}

Template.library.events({

    'change #category-filter': function() {

        // Get filter
        var filter = $('#category-filter :selected').val();

        // Set session
        Session.set('categoryFilter', filter);
    },
    'change #service-filter': function() {

        // Get filter
        var filter = $('#service-filter :selected').val();

        // Set session
        Session.set('serviceFilter', filter);
    }

});
