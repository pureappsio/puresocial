Template.newPost.helpers({

  files: function(){
       return S3.collection.find();
   },
  specificFormData: function() {
    return {
      id: this._id,
      hard: 'Lolcats'
    }
  },
  // myCallbacks: function() {
  //   return {
  //       finished: function(index, fileInfo, context) {
  //
  //         // Change character count
  //         var currentCount = $('#character-count').text();
  //         currentCount = parseInt(currentCount);
  //         $('#character-count').text(currentCount - 23);
  //
  //         // Set session image
  //         Session.set('uploadedFile', fileInfo);
  //       },
  //   }
  // },
  uploadedImage: function() {
    if (Session.get('uploadedFile')) {
      return Session.get('uploadedFile');
    }
    else {
      return "default.jpg";
    }
  },
  imageUploaded: function() {
    if (Session.get('uploadedFile')) {
      return true;
    }
    else {
      return false;
    }
  },
  getCategories: function() {
    return categories;
  },
  socialMediaChoices: function() {

    // Choices object
    var options = [];

    // Check for social media accounts
    if (Meteor.user().services) {
      if (Meteor.user().services.twitter) {
        for (var i = 0; i <  Meteor.user().services.twitter.length; i++) {
         options.push({media: 'Twitter', name: Meteor.user().services.twitter[i].screenName, displayName: Meteor.user().services.twitter[i].name});
        }
    }

      if (Meteor.user().services.facebook) {
        for (var i = 0; i <  Meteor.user().services.facebook.length; i++) {
          options.push({media: 'Facebook', name: Meteor.user().services.facebook[i].name, displayName: Meteor.user().services.facebook[i].name});
        }
      }

      if (Meteor.user().services.facebookPages) {
        for (var i = 0; i <  Meteor.user().services.facebookPages.length; i++) {
          options.push({media: 'Facebook Page', name: Meteor.user().services.facebookPages[i].name, displayName: Meteor.user().services.facebookPages[i].name});
        }
      }
    }

    return options;
  }

});

Template.newPost.events({

  "change .btn-file :file": function(event, template) {
    var files = event.currentTarget.files;
    $('#file-name').val(files[0].name);

  },
  "click button.upload": function() {

      // Get files
      var files = $("input.file_bag")[0].files

      // Upload
      S3.upload({
        files: files,
        path: "pictures"
      }, function(e,r){
        console.log('Callback: ');
        console.log(r);
        Session.set('uploadedFile', r.url);
      });
  },
  'keyup #postContent': function() {

    // Get number character
    var content = $("#postContent").val();
    var numberCharacter = content.length;

    if (Session.get('uploadedFile')) {
      baseCharacters = 140 - 23;
    }
    else {
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
          }
          else {
            $('#character-count').text(baseCharacters - numberCharacter + url.length - 23);
          }

        });
      }
      else {
        // Change count
        $('#character-count').text(baseCharacters - numberCharacter);
      }
    });

  },
  'click #savePost': function() {

      // Get value of elements
      var content = $('#postContent').val();
      var category = $('#postCategory').find(":selected").val();

      var media_data = $("input:checked");
      var media = [];
      for (var i = 0; i < media_data.length; i++) {

        // Split string
        var platform = media_data[i].value.split('-')[0];
        var userName = media_data[i].value.split('-')[1];
        var displayName = media_data[i].value.split('-')[2];

        var single_media = {platform: platform, userName: userName, displayName: displayName};

        media.push(single_media);
      }

      // Build post object
      var post = {};
      post.content = content;
      post.category = category;
      post.media = media;

      // Save image?
      if (Session.get('uploadedFile')) {
        post.picture = Session.get('uploadedFile');
      }

      console.log(post);

      //Store in DB
      Meteor.call('saveNewPost', post, function(err, data) {

        // Put confirmation message
        $('#confirm-add').text(' Saved!');

      });

    }

});
