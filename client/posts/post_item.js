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
    isVideo: function() {

        if ((this.content).includes('www.youtube.com/watch?v=')) {
            return true;
        }

    },
    videoLink: function() {

        var videoId = youtube_parser(this.content);

        return 'https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg';

    },
    isPicturePresent: function() {
        if (this.picture) {
            return true;
        } else {
            return false;
        }
    }
});

function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}
