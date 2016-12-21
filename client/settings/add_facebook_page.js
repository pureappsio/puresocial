Template.addFacebookPage.rendered = function() {

  if (Meteor.user().services.facebook) {
    Meteor.call("getFacebookPages", function (err, response) {
      console.log(response);
      Session.set('facebookPages', response);
    });
  }

};

Template.addFacebookPage.helpers({

  selectFacebookPages: function() {
    if (Meteor.user().services.facebook) {
      return Session.get('facebookPages');
    }
  }
  
});