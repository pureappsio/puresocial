Template.postItem.events({
    
    'click .delete': function(event, template) {
      
      // Store in DB
      Meteor.call('deletePost', template.data, function(error, data) {
        console.log("Deleted");
      });

    },
    'click .post': function(event, template) {
      
      // Store in DB
      Meteor.call('postNow', template.data, function(error, data) {
        console.log("Posted");
      });

    }
   
  });

Template.postItem.helpers({

  isNotCategoryFiltered: function() {

    if (Session.get('categoryFilter')) {
      categoryFilter = Session.get('categoryFilter');
      return categoryFilter[this.category];
    }
    else {
      return true;
    }
    
  },
  isNotMediaFiltered: function() {

    var isNotFiltered = true;

    if (Session.get('mediaChoice')) {
      mediaChoice = Session.get('mediaChoice');
      for (i = 0; i < this.media.length; i++) {

        if (mediaChoice[this.media[i].userName.replace(/\s+/g, '')] == false) {
          isNotFiltered = false;
        }

      }
      return isNotFiltered;
    }
    else {
      return isNotFiltered;
    }
    
  },
  getSocialMedia: function() {
  	return [];
  },
  isPicturePresent: function() {
    if (this.picture) {
      return true;
    }
    else {
      return false;
    }
  }
});