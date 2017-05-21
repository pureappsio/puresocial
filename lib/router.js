Router.configure({
    layoutTemplate: 'layout'
});

// Main route
Router.route('/', function() {

    if (!Meteor.userId()) {

        this.render('login');

    } else {

        this.render('home');

    }

});

Router.route('/login', {
    name: 'login'
});

Router.route('/signup', {
    name: 'signup'
});


Router.route('/audiences', {
    name: 'audiences'
});

Router.route('/sequences', {
    name: 'sequences'
});

Router.route('/import', {
    name: 'importPosts'
});

Router.route('/bot', {
    name: 'bot'
});

Router.route('/messengerqueues', {
    name: 'messengerQueues'
});

Router.route('/broadcasts', {
    name: 'broadcasts'
});

Router.route('/privacy-policy', {
    name: 'privacyPolicy'
});
Router.route('/tos', {
    name: 'tos'
});

Router.route('/new', {
    name: 'newPost'
});
Router.route('/settings', {
    name: 'settings'
});

// Queues
Router.route('/queue', {
    name: 'queue',
    data: function() {

        // Wait
        this.wait(Meteor.subscribe('userQueue'));

        // Render
        if (this.ready()) {
            this.render('queue');
        } else {
            this.render('loading');
        }
    }
});

// Library
Router.route('/library', {
    name: 'library',
    data: function() {

        // Wait
        this.wait(Meteor.subscribe('userPosts'));

        // Render
        if (this.ready()) {
            this.render('library');
        } else {
            this.render('loading');
        }
    }
});

Router.route('/end', {
    name: 'end',
    data: function() {

        // Set onboarding as over
        Meteor.call('stopOnboarding');

        // Wait
        this.wait(Meteor.subscribe('userData'));

        // Render
        if (this.ready()) {
            this.render('home');
        } else {
            this.render('loading');
        }

    }
});

Router.route('/schedule', {
    name: 'schedule'
});
Router.route('/addFacebookPage', {
    name: 'addFacebookPage'
});
Router.route('/admin', {
    name: 'admin'
});

Router.route('/posts/:_id', {
    name: 'postItem',
    data: function() {
        return Posts.findOne(this.params._id);
    }
});

Router.route('/audiences/:_id', {
    name: 'audienceDetails',
    data: function() {
        return Services.findOne(this.params._id);
    }
});

Router.route('/sequences/:_id', {
    name: 'sequenceDetails',
    data: function() {
        return Sequences.findOne(this.params._id);
    }
});


Router.route('/posts/:_id/edit', {
    name: 'postEdit',
    data: function() {
        return Posts.findOne(this.params._id);
    }
});

Router.route('/subscribers/:_id/message', {
    name: 'messageSubscriber',
    data: function() {
        return Subscribers.findOne(this.params._id);
    }
});

