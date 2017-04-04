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
                if (event.message) {
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
