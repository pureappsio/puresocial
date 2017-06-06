Template.serviceStatsDetails.helpers({

    posts: function() {

        var posts = Posts.find({ media: this._id }).fetch();

        for (i in posts) {
        	posts[i].serviceId = this._id;
        }

        console.log(posts);

        return posts;
    }

});
