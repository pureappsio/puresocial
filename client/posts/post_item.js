Template.postItem.events({

    'click .delete': function() {

        // Store in DB
        Meteor.call('deletePost', this, function(error, data) {
            console.log("Deleted");
        });

    },
    'click .post': function() {

        // Post
        Meteor.call('postNow', this, function(error, data) {
            console.log("Posted");
        });

    }

});

Template.postItem.helpers({

    pictureLink: function() {

        if (this.picture) {
            return Images.findOne(this.picture).link();
        }

    },
    formatMedia: function() {

        formatMedia = [];

        for (i in this.media) {

            formatMedia.push({ _id: this.media[i] })

        }

        return formatMedia;

    },
    getSocialMedia: function() {
        return [];
    },
    isPicturePresent: function() {
        if (this.picture) {
            return true;
        } else {
            return false;
        }
    }
});
