import FacebookAPI from 'fbgraph';
import FacebookBatch from 'fbgraph';
var qs = require('qs');

FacebookBatch.setVersion("2.8");
FacebookAPI.setVersion("2.8");

Future = Npm.require('fibers/future');

Meteor.methods({

    deleteSubscriber: function(subscriberId) {

        Subscribers.remove(subscriberId);

    },
    getSubscriberData: function(messengerId, serviceId) {

        console.log('Getting subscriber data');

        // Find token
        var service = Services.findOne(serviceId);
        var token = service.access_token;
        FacebookBatch.setAccessToken(token);

        console.log(serviceId);
        console.log(messengerId);

        // Get all subscribers
        var subscriber = Subscribers.findOne({ serviceId: serviceId, messengerId: messengerId });

        var myFuture = new Future();
        FacebookAPI.get(subscriber.messengerId + '?access_token=' + token, function(err, res) {

            if (err) {
                console.log(err);
                myFuture.return({});
            } else {
                console.log(res);
                myFuture.return(res);
            }

        });
        result = myFuture.wait();
        console.log(result);

        Subscribers.update(subscriber._id, {
            $set: {
                first_name: result.first_name,
                last_name: result.last_name,
                profile_pic: result.profile_pic,
                locale: result.locale,
                timezone: result.timezone,
                gender: result.gender
            }
        });

    },

    getAudienceSubscribersData: function(serviceId) {

        console.log('Getting audience data');

        // Find token
        var service = Services.findOne(serviceId);
        var token = service.access_token;
        FacebookBatch.setAccessToken(token);

        // Get all subscribers
        var subscribers = Subscribers.find({ serviceId: serviceId, first_name: { $exists: false } }, { limit: 49 }).fetch();
        console.log(subscribers);

        var requests = [];

        for (i in subscribers) {

            request = {
                method: "GET",
                relative_url: subscribers[i].messengerId
            }
            requests.push(request);
        }

        // console.log(requests);

        var myFuture = new Future();
        FacebookBatch.batch(requests, function(err, res) {

            // Result
            myFuture.return(res);

        });

        var result = myFuture.wait();
        console.log(result);

        var jsonResult = [];

        for (r in result) {
            jsonResult.push(JSON.parse(result[r].body));
        }

        console.log(jsonResult);

        for (j in subscribers) {

            Subscribers.update(subscribers[j]._id, {
                $set: {
                    first_name: jsonResult[j].first_name,
                    last_name: jsonResult[j].last_name,
                    profile_pic: jsonResult[j].profile_pic,
                    locale: jsonResult[j].locale,
                    timezone: jsonResult[j].timezone,
                    gender: jsonResult[j].gender
                }
            });

        }

    },
    addBotAutomation: function(automation) {

        console.log(automation);
        Automations.insert(automation);

    },
    deleteAutomation: function(automationId) {

        Automations.remove(automationId);

    },
    editAutomation: function(automation) {

        console.log(automation);
        Automations.update(automation._id, { $set: automation });

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

            // Check if data is present
            var subscriber = Subscribers.findOne({ serviceId: subscriber.serviceId, messengerId: subscriber.messengerId });
            if (subscriber.first_name) {
                console.log('Information present');
            } else {
                Meteor.call('getSubscriberData', subscriber.messengerId, subscriber.serviceId);
            }

        } else {

            console.log('Adding new subscriber')
            var subscriberId = Subscribers.insert(subscriber);

            // Add data
            Meteor.call('getSubscriberData', subscriber.messengerId, subscriber.serviceId)

        }

    },
    processMessengerEvent: function(event) {

        console.log('Event: ');
        console.log(event);

        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfMessage = event.timestamp;

        // Message or postback?
        if (event.message) {
            var message = event.message;
            var messageText = message.text;
        }
        if (event.postback) {
            var message = event.postback.payload;
            var messageText = message;
        }

        console.log("Received message for user %d and page %d at %d with message:",
            senderID, recipientID, timeOfMessage);
        console.log(message);

        // var messageId = message.mid;
        // var messageAttachments = message.attachments;

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

                // Add social tag
                answer = Meteor.call('addSocialTag', answer, 'messenger');
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
    sendMessengerIndividual: function(message) {

        // Get service
        var service = Services.findOne(message.serviceId);

        // Message data
        var messageData = Meteor.call('buildMessageData', message.messengerId, message);

        // console.log(messageData.message.attachment.payload.elements[0].default_action);

        Meteor.call('sendMessengerMessage', service, messageData);

    },
    processMessengerContent: function(content) {

        // Add social tag to links
        console.log('Processing ...')
        var modContent = Meteor.call('addSocialTag', content, 'messenger');
        return modContent;

    },
    buildMessageData: function(messengerId, message) {

        // Subscriber
        var messageData = {
            recipient: {
                id: messengerId
            }
        }

        if (message.type == 'text') {

            // Process content
            var content = Meteor.call('processMessengerContent', message.message);

            messageData.message = {
                text: content
            };
        }

        if (message.type == 'video') {

            messageData.message = {
                attachment: {
                    type: 'video',
                    payload: {
                        url: message.videoUrl
                    }
                }
            };

        }

        if (message.type == 'buttons') {

            // Process content
            for (b in message.buttons) {
                message.buttons[b].url = Meteor.call('processMessengerContent', message.buttons[b].url);
            }

            messageData.message = {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: message.message,
                        buttons: message.buttons
                    }
                }
            };

        }

        if (message.type == 'generic') {

            // Process content
            for (b in message.buttons) {
                message.buttons[b].url = Meteor.call('processMessengerContent', message.buttons[b].url);
            }


            var element = {
                title: message.title,
                buttons: message.buttons
            }

            if (message.image_url) {
                element.image_url = message.image_url;
            }

            if (message.subtitle) {
                element.subtitle = message.subtitle;
            }

            if (message.default_action) {

                // Process content
                message.default_action = Meteor.call('processMessengerContent', message.default_action);

                default_action = {
                    type: "web_url",
                    url: message.default_action
                        // messenger_extensions: true,
                        // fallback_url: message.default_action
                }
                element.default_action = default_action;

            }

            var payload = {
                template_type: "generic",
                elements: [element]
            }

            messageData.message = {
                attachment: {
                    type: "template",
                    payload: payload
                }
            };

        }

        return messageData;

    },
    sendMessengerBroadcast: function(message) {

        // Get service
        var service = Services.findOne(message.serviceId);

        // Get all subscribers
        var subscribers = Subscribers.find({ serviceId: service._id }).fetch();

        requests = [];

        for (i in subscribers) {

            var messageData = Meteor.call('buildMessageData', subscribers[i].messengerId, message);

            console.log(messageData);

            // Meteor.call('sendMessengerMessage', service, messageData);

            request = {
                method: "POST",
                relative_url: service.id + '/messages',
                body: qs.stringify(messageData)
            }
            requests.push(request);

        }

        console.log(requests);

        // Send
        var token = service.access_token;
        FacebookBatch.setAccessToken(token);

        // Cut by batch of 50
        var batchedRequests = [];
        var apiLimit = 45;

        if (requests.length < apiLimit) {
            var batchedRequests = [requests];
        } else {
            var splitRequest = [];
            var requestGroups = Math.ceil(requests.length / apiLimit);
            for (g = 0; g < requestGroups; g++) {
                batchedRequests[g] = requests.slice(g * apiLimit, apiLimit * (g + 1));
            }
        }

        for (b in batchedRequests) {
            console.log(batchedRequests[b].length);
        }

        for (r in batchedRequests) {

            var myFuture = new Future();
            FacebookBatch.batch(batchedRequests[r], function(err, res) {

                // Result
                myFuture.return(res);

            });

            var result = myFuture.wait();
            console.log(result);

        }

    }

});
