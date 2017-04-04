import FacebookAPI from 'fbgraph';
FacebookAPI.setVersion("2.8");
Future = Npm.require('fibers/future');

Meteor.methods({

    addBotAutomation: function(automation) {

        console.log(automation);
        Automations.insert(automation);

    },
    deleteAutomation: function(automationId) {

        Automations.remove(automationId);

    },
    getAppToken: function() {

        // Request
        url = 'https://graph.facebook.com/oauth/access_token';
        url += '?client_id=' + Meteor.settings.facebookOnline.appId;
        url += '&client_secret=' + Meteor.settings.facebookOnline.secret;
        url += '&grant_type=client_credentials'

        var result = HTTP.get(url);
        var content = JSON.parse(result.content);
        var token = content.access_token;

        console.log('App token:' + token);

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

        var myFuture = new Future();
        FacebookAPI.get(Meteor.settings.facebookOnline.appId + '/subscriptions?access_token=' + token, function(err, res) {

            if (err) {
                console.log(err);
                myFuture.return({});
            } else {
                console.log(res.data);
                myFuture.return(res.data);
            }

        });

        return myFuture.wait();

    },
    createBotWebhook: function() {

        // Check webhooks
        var hooks = Meteor.call('readSubscriptions');
        console.log(hooks)

        var hookUrl = Meteor.absoluteUrl() + 'api/messenger';
        // var hookUrl = 'https://44043141.ngrok.io/api/messenger';

        var hookExists = false;

        for (h in hooks) {

            var url = hooks[h].callback_url;

            if (url.indexOf(hookUrl) != -1) {
                hookExists = true;
            }
        }

        if (!hookExists) {
            Meteor.call('createWebhook', hookUrl);
            console.log('New hook created');
        }

    },
    createWebhook: function(hookUrl) {

        // Find token
        var service = Services.findOne({ type: 'facebookApp' })
        var token = service.access_token;

        console.log('App token:' + token);

        // Request data
        var data = {
            object: "page",
            callback_url: hookUrl,
            fields: "messages, message_deliveries, message_reads, messaging_postbacks",
            verify_token: Meteor.settings.facebookOnline.botToken
        }
        console.log(data);

        var myFuture = new Future();
        FacebookAPI.post(Meteor.settings.facebookOnline.appId + '/subscriptions?access_token=' + token, data, function(err, res) {

            if (err) {
                console.log(err);
                myFuture.return({});
            } else {
                console.log(res);
                myFuture.return(res);
            }

        });

        return myFuture.wait();

    },
    subscribePage: function(serviceId) {

        console.log('Subscribing page');

        // Find token
        var service = Services.findOne(serviceId);
        var token = service.access_token;

        var myFuture = new Future();
        FacebookAPI.post(service.id + '/subscribed_apps?access_token=' + token, {}, function(err, res) {

            // Result
            console.log(res);

        });

        Services.update(serviceId, { $set: { bot: 'on' } });

        console.log(Services.findOne(serviceId));

        return myFuture.wait();

    },
    unSubscribePage: function(serviceId) {

        console.log('Unsubscribing page');

        // Find token
        var service = Services.findOne(serviceId);
        var token = service.access_token;

        var myFuture = new Future();
        FacebookAPI.del(service.id + '/subscribed_apps?access_token=' + token, {}, function(err, res) {

            // Result
            console.log(res);

        });


        Services.update(serviceId, { $set: { bot: 'off' } });

        console.log(Services.findOne(serviceId));

        return myFuture.wait();

    },
    apiTest: function() {

        console.log('API test');

        // Services.remove({});
        // Automations.remove({});
        Posts.remove({});
        // Automations.remove({});
        Queues.remove({});
        // Schedules.remove({});
        // Subscribers.remove({});

        // Meteor.call('readSubscriptions');

        // var service = Services.findOne("j8hZBiaLKibLi4E5S");

        // Meteor.call('sendMessengerMessage', service, {
        //     recipient: {
        //         id: "1295216883899545"
        //     },
        //     message: {
        //         text: "Just checking on you :)"
        //     }
        // });

        // Meteor.call('createBotWebhook');
        // Meteor.call('subscribePage', '');

    },
    addMessengerSubscriber: function(subscriber) {

        if (Subscribers.findOne({ serviceId: subscriber.serviceId, messengerId: subscriber.messengerId })) {

            console.log('Existing messenger subscriber');

        } else {

            console.log(subscriber);
            Subscribers.insert(subscriber);

        }

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

        // Look for service
        var service = Services.findOne({ id: recipientID });
        console.log('Service: ');
        console.log(service);

        // Add to audience
        var subscriber = {
            messengerId: event.sender.id,
            serviceId: service._id,
            userId: service.userId,
            date: new Date()
        }
        Meteor.call('addMessengerSubscriber', subscriber);

        if (messageText) {

            // Convert to lower case for matching
            messageText = messageText.toLowerCase();

            console.log('Message text: ');
            console.log(messageText);

            // Look for all automations
            var automations = Automations.find({ serviceId: service._id }).fetch();
            console.log('Automations: ');
            console.log(automations);

            answered = false;
            for (a in automations) {

                var automation = automations[a];
                var keywords = automation.keywords;

                for (k in keywords) {
                    if (messageText.indexOf(keywords[k]) != -1) {
                        console.log('Matching keyword: ' + keywords[k]);
                        answer = automation.message;
                        answered = true;
                    }
                }
            }

            // // Default 
            // if (!answered) {
            //     answer = "I didn't quite get that. You can ask me for help if to know everything I can do for you :)";
            // }

            if (answered) {

                console.log('Answer: ' + answer);

                var messageData = {
                    recipient: {
                        id: senderID
                    },
                    message: {
                        text: answer
                    }
                };

                Meteor.call('sendMessengerMessage', service, messageData);

            }

        }

        // else if (messageAttachments) {
        //     sendTextMessage(senderID, "Message with attachment received");
        // }

    },
    sendMessengerMessage: function(service, messageData) {

        var token = service.access_token;

        FacebookAPI.post(service.id + '/messages?access_token=' + token, messageData, function(err, res) {

            // Result
            console.log(res);

        });

    },
    sendMessengerBroadcast: function(message) {

        // Get service
        var service = Services.findOne(message.serviceId);

        // Get all subscribers
        var subscribers = Subscribers.find({ serviceId: service._id }).fetch();

        for (i in subscribers) {

            var messageData = {
                recipient: {
                    id: subscribers[i].messengerId
                },
                message: {
                    text: message.message
                }
            };

            console.log(messageData);

            Meteor.call('sendMessengerMessage', service, messageData);
        }

    }

});
