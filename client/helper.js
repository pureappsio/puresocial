Handlebars.registerHelper('getCategoryName', function(category) {

    if (category == 'blogPosts') {
        return "Blog Posts";
    }
    if (category == 'useOnce') {
        return "Use Once";
    }
    if (category == 'promotion') {
        return "Promotional";
    }
    if (category == 'podcasts') {
        return "Podcasts";
    }
    if (category == 'videos') {
        return "Videos";
    }

});

Handlebars.registerHelper('formatDate', function(date) {

    return date.getDate();

});

// Handlebars.registerHelper('isPixel', function(date) {

//     Meteor.call('isPixel', function(err, data) {
//         return data;
//     });

// });

// Handlebars.registerHelper('pixel', function(date) {

//     Meteor.call('getPixel', function(err, data) {
//         return data;
//     });

// });

Handlebars.registerHelper('formatContent', function(content) {

    contentLength = 75;
    if (content.length > contentLength) {
        return content.substring(0, contentLength) + '...';
    } else {
        return content;
    }

});

Handlebars.registerHelper('isAdmin', function() {

    if (Meteor.user()) {
        if (Meteor.user().emails[0].address == 'marcolivier.schwartz@gmail.com' || Meteor.user().emails[0].address == 'admin@schwartzindustries.com') {
            return true;
        }
    }
});

Handlebars.registerHelper('newUser', function() {
    // if (!Meteor.user().services.twitter && !Meteor.user().services.facebook && !Meteor.user().services.facebookPages) {
    //     return true;
    // } else {
    //     return false;
    // }

    return false;
});

Handlebars.registerHelper('userAccountLinked', function() {
    // if (Meteor.user().services.twitter || Meteor.user().services.facebook || Meteor.user().services.facebookPages) {
    //     return true;
    // } else {
    //     return false;
    // }

    return true;
});

Handlebars.registerHelper('userScheduleSet', function() {

    // var schedules = Schedules.find({}).fetch();
    // if (schedules.length >= 4) {
    //     return true;
    // } else {
    //     return false;
    // }

    return true;

});

Handlebars.registerHelper('userPostCreated', function() {

    // var posts = Posts.findOne({});
    // if (posts) {
    //     return true;
    // } else {
    //     return false;
    // }

    return true;

});

Handlebars.registerHelper('onboardingProcess', function() {

    // if (Meteor.user().profile.onboarding) {
    //   return true;
    // }
    // else {
    //   return false;
    // }

    return false;

});
