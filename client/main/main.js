// Global variables
categories = [{ name: 'blogPosts' },
    { name: 'useOnce' },
    { name: 'promotion' },
    { name: 'podcasts' },
    { name: 'videos' }
];

// Tracker
Tracker.autorun(function() {
    Meteor.subscribe('userData');
    Meteor.subscribe('userPosts');
    Meteor.subscribe('userQueue');
    Meteor.subscribe('userSchedule');
    Meteor.subscribe('userServices');
    Meteor.subscribe('userAutomations');
    Meteor.subscribe('userAudiences');
    Meteor.subscribe('userSubscribers');
    Meteor.subscribe('userIntegrations');
    Meteor.subscribe('files.images.all');
});

// Imports
import 'bootstrap';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';

const Spinner = require('spin');