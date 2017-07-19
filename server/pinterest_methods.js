var PDK = require('node-pinterest');
Future = Npm.require('fibers/future');

Meteor.methods({

    postPin: function(post) {

        // Get service
        var service = Services.findOne(post.serviceId);

        // Get pinterest object
        var pinterest = PDK.init(service.accessToken);

        // Get boards
        var boards = Meteor.call('getBoards', post.serviceId);

        // Find link
        var isLinkPresent = Meteor.call('isLinkPresent', post.content);

        if (isLinkPresent) {

            // Get URL
            var url = Meteor.call('linkify', post.content);
            var link = Meteor.call('shortenLink', post);

            // Remove URL from message
            post.content = (post.content).replace(url, "");

        }

        // Image present ?
        if (post.picture) {

            // Load picture
            console.log('Posting FB picture');
            var imgUrl = Images.findOne(post.picture).versions.original.meta.pipeFrom;

        }

        // Post pin
        pinterest.api('pins', {
            method: 'POST',
            body: {
                board: boards[0].id,
                note: post.content,
                link: link,
                image_url: imgUrl
            }
        }).then(function(json) {
            pinterest.api('me/pins').then(console.log);
        });

    },
    getBoards: function(serviceId) {

        // Get service
        var service = Services.findOne(serviceId);

        // Get pinterest object
        var pinterest = PDK.init(service.accessToken);

        // Get boards
        var myFuture = new Future();
        pinterest.api('me/boards').then(function(json) {

            myFuture.return(json.data);

        });

        var boards = myFuture.wait();
        console.log(boards);

        return boards;

    },
    deletePinterestAccount: function(serviceId) {

        Services.remove(serviceId);

    },
    userAddPinterestOauthCredentials: function(token, secret) {

        // Retrieve data
        // if (Pinterest.retrieveCredential(token, secret)) {
        var service = Pinterest.retrieveCredential(token, secret).serviceData;
        // } else {

        //     service = {
        //         accessToken: 'AbZ-GW_sMmnRoLAc9s7BhzzUjSSXFMXS1qGcZw1EEdbowKAshAAAAAA',
        //         url: 'https://www.pinterest.com/openhomeauto/',
        //         first_name: 'Open Home Automation',
        //         last_name: '',
        //         id: '534028605722760828'
        //     }

        // }

        service.userId = Meteor.user()._id;
        service.type = 'pinterest';
        if (service.first_name) {
            service.name = service.first_name;
        }

        console.log(service);

        // Check if exists
        if (Services.findOne({ id: service.id, type: 'pinterest', userId: Meteor.user()._id })) {

            console.log('Already existing Pinterest data');

        } else {
            Services.insert(service);
        }

    },

});
