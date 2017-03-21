import FacebookAPI from 'fbgraph';
FacebookAPI.setVersion("2.8");

Meteor.methods({

    addWelcomeBotMessage: function(automation) {

        console.log(automation);
        Automations.insert(automation);

    },
    getAppToken: function() {

        // Request
        url = 'https://graph.facebook.com/oauth/access_token';
        url += '?client_id=' + Meteor.settings.facebookOnline.appId;
        url += '&client_secret=' + Meteor.settings.facebookOnline.secret;
        url += '&grant_type=client_credentials'

        var result = HTTP.get(url);
        var token = (result.content).substring(13);

        if (Services.findOne({ type: 'facebookApp' })) {
            Services.update({ type: 'facebookApp' }, { $set: { access_token: token } });
        } else {
            Services.insert({ access_token: token, type: 'facebookApp' });
        }

    },
    readSubscriptions: function() {

        // Find token
        var service = Services.findOne({ type: 'facebookApp' })
        var token = service.access_token;

        FacebookAPI.get(Meteor.settings.facebookOnline.appId + '/subscriptions?access_token=' + token, function(err, res) {

            // Result
            console.log(res);

        });

    },
    createWebhook: function() {

        // Find token
        var service = Services.findOne({ type: 'facebookApp' })
        var token = service.access_token;

        // Request data
        var data = {
            object: "page",
            callback_url: 'https://puresocial.io/api/messenger',
            fields: "messages",
            verify_token: 'puresocial'
        }

        FacebookAPI.post(Meteor.settings.facebookOnline.appId + '/subscriptions?access_token=' + token, data, function(err, res) {

            // Result
            console.log(res);

        });

    },
    subscribePage: function(serviceId) {

        // Find token
        // var service = Services.findOne(serviceId)        
        // var token = service.access_token;
        var token = 'EAAFZAkfnDx7gBANCdQUPlz4JHOrc1H5LYr4YBo6g05eAZBgkKPmd2pDQjJD9rNTWh9C6QVY8dkUp9kv5cmHVbIrlsWI3jrptasrqf6UFB6Hg0YVkEZAZA9mwiUsK72rItfwen0bVQ9nTX2NZC1SbCewDHcjXIYz0mhAJZCNDCzfQZDZD';

        FacebookAPI.post('me/subscribed_apps?access_token=' + token, {}, function(err, res) {

            // Result
            console.log(res);

        });

    },
    apiTest: function() {

        console.log('API test')

       	Meteor.call('readSubscriptions');

        // Meteor.call('createWebhook');
        // Meteor.call('subscribePage', '');

    },

    processMessengerEvent: function(event) {

    	console.log('Event: ');
    	console.log(event);

        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfMessage = event.timestamp;
        var message = event.message;

        console.log("Received message for user %d and page %d at %d with message:",
            senderID, recipientID, timeOfMessage);
        console.log(JSON.stringify(message));

        var messageId = message.mid;

        var messageText = message.text;
        var messageAttachments = message.attachments;

        if (messageText) {

            // Convert to lower case for matching
            messageText = messageText.toLowerCase();

            if (messageText.indexOf('hello') != -1) {
                answer = "Hello, welcome on our page! This is an automated response. What can we do for you today?";
            }
            else if (messageText.indexOf('what can you do') != -1 || messageText.indexOf('help') != -1) {
                answer = "I can do many things for you. Try asking me about our website, about probiotics or about our current best article and I'll redirect you to our best resources.";
            }
            else if (messageText.indexOf('probiotics') != -1 ) {
                answer = "Wondering if you should give you dog probiotics? Check this article on the topic: https://caninewell.com/should-i-give-my-dog-probiotics";
            }
            else if (messageText.indexOf('website') != -1 ) {
                answer = "You will find all informations about dog health & supplements for dogs on our website at https://caninewell.com";
            }
            else if (messageText.indexOf('best article') != -1 ) {
                answer = "I really recommend this article that is our #1 most read article on our site: https://caninewell.com/best-probiotics-for-dogs";
            }
            else {
                answer = "I didn't quite get that. You can ask me for help if to know everything I can do for you :)";
            }

            var messageData = {
                recipient: {
                    id: senderID
                },
                message: {
                    text: answer
                }
            };

            Meteor.call('sendMessengerMessage', messageData);


        } else if (messageAttachments) {
            sendTextMessage(senderID, "Message with attachment received");
        }

    },
    sendMessengerMessage: function(messageData) {

    	var token = 'EAAFZAkfnDx7gBANCdQUPlz4JHOrc1H5LYr4YBo6g05eAZBgkKPmd2pDQjJD9rNTWh9C6QVY8dkUp9kv5cmHVbIrlsWI3jrptasrqf6UFB6Hg0YVkEZAZA9mwiUsK72rItfwen0bVQ9nTX2NZC1SbCewDHcjXIYz0mhAJZCNDCzfQZDZD';

        FacebookAPI.post('me/messages?access_token=' + token, messageData, function(err, res) {

            // Result
            console.log(res);

        });

    }

});
