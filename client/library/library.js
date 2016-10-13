Template.library.helpers({

  showFilters: function() {
    return Session.get('showFilter');
  },
  posts: function() {
    return Posts.find({});
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

    Session.set('mediaOptions', options);
    return options;
  }

});

Template.library.rendered = function() {

   // Show or hide filters
   Session.set('showFilter', true);

   // Set filters value
   if (Session.get('categoryFilter')) {
     for (i = 0; i < categories.length; i ++) {
       $("#" + categories[i].name).attr('checked', categoryFilter[categories[i].name]);
     }
   }

   // Set media values
   if (Session.get('mediaChoice')) {
     for (i = 0; i < Session.get('mediaOptions').length; i ++) {
       $("#" + Session.get('mediaOptions')[i].name.replace(/\s+/g, '')).attr('checked', mediaChoice[Session.get('mediaOptions')[i].name.replace(/\s+/g, '')]);
     }
   }

}

Template.library.events({

  'change .media-choice': function() {

    // Social media options 
    options = Session.get('mediaOptions');

    // Get value of all term filters
    mediaChoice = {};
    for (i = 0; i < options.length; i ++) {
      mediaChoice[options[i].name.replace(/\s+/g, '')] = $("#" + options[i].name.replace(/\s+/g, '')).is(':checked')
    }
    console.log(mediaChoice);

    // Set session
    Session.set('mediaChoice', mediaChoice);
  },

  'change .category-filter': function() {
    
    // Get value of all term filters
    categoryFilter = {};
    for (i = 0; i < categories.length; i ++) {
      categoryFilter[categories[i].name] = $("#" + categories[i].name).is(':checked')
    }
    console.log(categoryFilter);

    // Set session
    Session.set('categoryFilter', categoryFilter);
  },
  'click #show-filter': function() {

    if (Session.get('showFilter')) {

      $('#show-filter').text('Show Filters');
      Session.set('showFilter', false);

    }
    else {
      $('#show-filter').text('Hide Filters');
      Session.set('showFilter', true);
    }

  }

});