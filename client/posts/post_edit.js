Template.postEdit.helpers({

    files: function() {
        return S3.collection.find();
    },

    specificFormData: function() {
        return {
            id: this._id,
            hard: 'Lolcats'
        }
    },
    uploadedImage: function() {
        if (Session.get('uploadedFile')) {
            return Images.findOne(Session.get('uploadedFile')).link();
        } else if (this.picture) {
            return Images.findOne(this.picture).link();
        } else {
            return "default.jpg";
        }
    },
    imageUploaded: function() {
        if (this.picture || Session.get('uploadedFile')) {
            return true;
        } else {
            return false;
        }
    },
    getCategories: function() {
        return categories;
    },
    socialMediaChoices: function() {

        return Services.find({});
    }

});

Template.postEdit.rendered = function() {

    console.log(this.data);

    Session.set('uploadedFile', null);

    // Get number character
    var content = $("#postContent").val();
    var numberCharacter = content.length;

    if (Session.get('uploadedFile')) {
        baseCharacters = 140 - 23;
    } else {
        baseCharacters = 140;
    }

    // URL detected?
    Meteor.call('isLinkPresent', content, function(err, data) {
        if (data) {
            Meteor.call('linkify', content, function(err, url) {
                console.log(url);

                // Change count
                if (url.length < 23) {
                    $('#character-count').text(baseCharacters - numberCharacter);
                } else {
                    $('#character-count').text(baseCharacters - numberCharacter + url.length - 23);
                }

            });
        } else {
            // Change count
            $('#character-count').text(baseCharacters - numberCharacter);
        }
    });

    // Set selected option
    $("#postCategory").val(this.data.category);

    // Set social media selecteds
    for (var i = 0; i < this.data.media.length; i++) {

        $('#' + this.data.media).attr('checked', true);
    }

}

Template.postEdit.events({

    // "change .btn-file :file": function(event, template) {
    //     var files = event.currentTarget.files;
    //     $('#file-name').val(files[0].name);

    // },
    // "click button.upload": function() {

    //     // Get files
    //     var files = $("input.file_bag")[0].files

    //     // Upload
    //     S3.upload({
    //         files: files,
    //         path: "pictures"
    //     }, function(e, r) {
    //         console.log('Callback: ');
    //         console.log(r);
    //         Session.set('uploadedFile', r.url);
    //     });
    // },
    'keyup #postContent': function() {

        // Get number character
        var content = $("#postContent").val();
        var numberCharacter = content.length;

        if (Session.get('uploadedFile')) {
            baseCharacters = 140 - 23;
        } else {
            baseCharacters = 140;
        }

        // URL detected?
        Meteor.call('isLinkPresent', content, function(err, data) {
            if (data) {
                Meteor.call('linkify', content, function(err, url) {
                    console.log(url);

                    // Change count
                    if (url.length < 23) {
                        $('#character-count').text(baseCharacters - numberCharacter);
                    } else {
                        $('#character-count').text(baseCharacters - numberCharacter + url.length - 23);
                    }

                });
            } else {
                // Change count
                $('#character-count').text(baseCharacters - numberCharacter);
            }
        });

    },

    'click #updatePost': function(event, template) {

        // Get value of elements
        var content = $('#postContent').val();
        var category = $('#postCategory').find(":selected").val();

        var media_data = $("input:checked");

        var media = [];
        for (var i = 0; i < media_data.length; i++) {

            media.push($(media_data[i]).attr("id"));

        }

        // Build post object
        var post = this;
        post.content = content;
        post.category = category;
        post.media = media;

        // Save new image?
        if (Session.get('uploadedFile')) {
            post.picture = Session.get('uploadedFile');
        }

        console.log(post);

        //Store in DB
        Meteor.call('updatePost', post, function(err, data) {

            // Put confirmation message
            $('#confirm-update').text(' Updated!');

        });

    }

});
