Meteor.methods({

    stopOnboarding: function() {

        // Stop
        Meteor.users.update({ _id: Meteor.user()._id }, { $set: { "profile.onboarding": false } }, function(error) {
            if (error) { console.log(error); }
        });

    },
    deleteUser: function(id) {

        // Delete
        Meteor.users.remove(id);
    },
    addIntegration: function(data) {

        // Insert
        console.log(data);
        Integrations.insert(data);

    },
    removeIntegration: function(data) {

        // Insert
        Integrations.remove(data);

    },
    importPosts: function(parameters) {

        console.log(parameters);

        var integration = Integrations.findOne(parameters.integrationId);

        url = 'https://' + integration.url + '/api/posts?key=' + integration.key;

        if (parameters.type) {
            url += '&category=' + parameters.type;
        }

        console.log(url);

        var answer = HTTP.get(url);
        var posts = answer.data.posts;

        for (i in posts) {

            // Build post object
            var post = {};
            link = 'https://' + integration.url + '/' + posts[i].url;

            if (parameters.prefix) {
                post.content = parameters.prefix + posts[i].title + " " + link;
            } else {
                post.content = posts[i].title + " " + link;
            }

            post.category = parameters.category;
            post.media = parameters.media;
            post.userId = Meteor.user()._id;
            post.submitted = new Date();
            post.importId = posts[i]._id;


            if (Posts.findOne({ importId: posts[i]._id })) {
                console.log('Existing post');
            } else {
                Posts.insert(post);
                console.log(post);
            }

        }

        // Regenerate queue
        Meteor.call('generateQueue', Meteor.user());

    }

});
