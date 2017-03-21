Template.queueElement.helpers({

    formatDate: function(date) {
        theDate = new Date(date);
        localDate = new Date(theDate.toLocaleString());

        return theDate.getDate() + '/' + (theDate.getMonth() + 1) + '/' + theDate.getFullYear() + ' ' + theDate.getHours() + ':00';
    },
    mediaType: function() {
        var type = Services.findOne(this.serviceId).type;

        if (type == 'facebook') {
            return 'Facebook'
        } else if (type == 'facebookPage') {
            return 'Facebook Page'
        } else {
            return 'Twitter';
        }
    },
    mediaName: function() {
        return Services.findOne(this.serviceId).name;
    }

});

Template.queueElement.events({

    'click .post-queue': function(event, template) {

        // Store in DB
        Meteor.call('postQueueItem', template.data, Meteor.user(), function(error, data) {
            console.log("Posted");
        });

    }
});
