// API
Router.route("/api/messenger", { where: "server" }).get(function() {

    console.log('Answer received')
    console.log(this.params.query)

    if (this.params.query['hub.mode'] === 'subscribe' &&
        this.params.query['hub.verify_token'] === Meteor.settings.facebookOnline.botToken) {
        console.log("Validating webhook");
        this.response.setHeader('Content-Type', 'application/text');
        this.response.end(this.params.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");

        this.response.setHeader('Content-Type', 'application/json');
        this.response.end(JSON.stringify({ 'error': 'error' }));
    }

}).post(function() {

    var data = this.request.body;
    console.log(data);

    // Make sure this is a page subscription
    if (data.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function(entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.message || event.postback) {
                    Meteor.call('processMessengerEvent', event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });

        // Assume all went well.
        this.response.setHeader('Content-Type', 'application/text');
        this.response.end("OK");
    }

});

// API access for active users
Router.route('/api/activeusers', {
    where: 'server',
    action: function() {

        // Get API key
        var key = this.params.query.api_key;
        if (key == 'gkljioho64') {
            var json = {
                'activeusers': Meteor.call('getAllActiveUsers')
            }
        } else {
            var json = {
                'message': 'Non authorized'
            };
        }
        this.response.setHeader('Content-Type', 'application/json');
        this.response.end(JSON.stringify(json));
    }
});

// Link shortener
Router.route('/link/:id', {
    where: 'server',
    action: function() {

        // Get post
        var post = Posts.findOne(this.params.id);
        console.log(post);

        // Insert stat
        var stat = {
            postId: post._id,
            type: 'click',
            date: new Date(),
            userId: post.userId
        }

        // Check for medium
        if (this.params.query.service) {
            stat.serviceId = this.params.query.service;
        }

        // Insert
        console.log(stat);
        Stats.insert(stat);

        // Get URL
        var url = Meteor.call('linkify', post.content);

        // Add social tag
        if (this.params.query.service) {
            service = Services.findOne(this.params.query.service);

            if (service.type == 'facebookPage' || service.type == 'facebook') {
                medium = 'facebook';
            }
            if (service.type == 'twitter') {
                medium = 'twitter';
            }
            if (service.type == 'pinterest') {
                medium = 'pinterest';
            }

        } else {
            medium = 'facebook';
        }
        url = Meteor.call('addSocialTag', url, medium);
        console.log(url);

        // Send response
        this.response.writeHead(302, {
            'Location': url
        });
        this.response.end();

    }
});

// API access for users
Router.route('/api/users', {
    where: 'server',
    action: function() {

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

                var json = {
                    'users': totalUsers
                };

            } else {
                var json = {
                    'users': Meteor.users.find({}).count()
                };
            }
        } else {
            var json = {
                'message': 'Non authorized'
            };
        }
        this.response.setHeader('Content-Type', 'application/json');
        this.response.end(JSON.stringify(json));
    }
});

Router.route("/api/subscribers", { where: "server" }).get(function() {

    // Get data
    var key = this.params.query.key;

    // Build query
    var query = {};

    if (this.params.query.from && this.params.query.to) {

        // Parameters
        from = new Date(this.params.query.from)
        to = new Date(this.params.query.to)

        // Set to date to end of day
        to.setHours(23);
        to.setMinutes(59);
        to.setSeconds(59);

        // Query
        query.date = { $gte: from, $lte: to };

    }

    // Service
    if (this.params.query.service) {
        query.serviceId = this.params.query.service;
    }

    var subscribers = Subscribers.find(query).fetch();

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    if (Meteor.call('validateApiKey', key)) {
        this.response.end(JSON.stringify({ subscribers: subscribers }));
    } else {
        this.response.end(JSON.stringify({ message: "API key invalid" }));
    }

});

Router.route("/api/services", { where: "server" }).get(function() {

    // Get data
    var key = this.params.query.key;

    // Build query
    var query = {};

    // Type
    if (this.params.query.service) {
        query.serviceId = this.params.query.service;
    }

    var services = Services.find(query).fetch();

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    if (Meteor.call('validateApiKey', key)) {
        this.response.end(JSON.stringify({ services: services }));
    } else {
        this.response.end(JSON.stringify({ message: "API key invalid" }));
    }

});

Router.route("/api/posts", { where: "server" }).get(function() {

    // Get data
    var key = this.params.query.key;

    // Build query
    var query = {};

    var posts = Posts.find(query).fetch();

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    if (Meteor.call('validateApiKey', key)) {
        this.response.end(JSON.stringify({ posts: posts }));
    } else {
        this.response.end(JSON.stringify({ message: "API key invalid" }));
    }

});
