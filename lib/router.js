Router.configure({
  layoutTemplate: 'layout'
});

// Main route
Router.route('/', function () {

  // Wait
  this.wait(Meteor.subscribe('userData'));

  // Render
  if (this.ready()) {
    this.render('home');
  } else {
    this.render('loading');
  }

});

Router.route('/new', {name: 'newPost'});
Router.route('/settings', {name: 'settings'});

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

Router.route('/schedule', {name: 'schedule'});
Router.route('/addFacebookPage', {name: 'addFacebookPage'});
Router.route('/admin', {name: 'admin'});

Router.route('/posts/:_id', {
    name: 'postItem',
    data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id); }
});

// API access for active users
Router.route('/api/activeusers', {
  where: 'server',
  action: function () {

  	// Get API key
  	var key = this.params.query.api_key;
  	if (key == 'gkljioho64') {
  	  var json = {'activeusers': Meteor.call('getAllActiveUsers')}
  	}
  	else {
  	  var json = {'message': 'Non authorized'};
  	}
  	this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify(json));
  }
});

// API access for users
Router.route('/api/users', {
  where: 'server',
  action: function () {

  	// Get API key
  	var key = this.params.query.api_key;
  	if (key == 'gkljioho64') {

      if (this.params.query.from && this.params.query.to) {

        var totalUsers = 0;

        var users = Meteor.users.find({}).fetch();
        var fromDate = new Date(this.params.query.from);
        var toDate = new Date(this.params.query.to);

        for (i = 0; i < users.length; i++) {
          var userCreationDate = new Date(users[i].createdAt);
          if (userCreationDate.getTime() > fromDate.getTime() && userCreationDate.getTime() < toDate.getTime()) {
            totalUsers = totalUsers + 1;
          }
        }

        var json = {'users': totalUsers};

      }
      else {
        var json = {'users': Meteor.users.find({}).count()};
      }
  	}
  	else {
  	  var json = {'message': 'Non authorized'};
  	}
    this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify(json));
  }
});
