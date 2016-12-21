// Global variables
categories = [{name: 'blogPosts'},
  {name: 'useOnce'},
  {name: 'promotion'},
  {name: 'podcasts'},
  {name: 'videos'}];

// Tracker
Tracker.autorun(function() {
    Meteor.subscribe('userData');
    Meteor.subscribe('userPosts');
    Meteor.subscribe('userQueue');
    Meteor.subscribe('userSchedule');
    Meteor.subscribe('userServices');
});
