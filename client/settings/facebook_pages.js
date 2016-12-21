Template.facebookPages.events({
 
  'click .add-page': function (event, template) {

  	// Log
    console.log(template.data);

    // Add profile to user profile
    Meteor.call('userAddFacebookPage', template.data);
  }

});