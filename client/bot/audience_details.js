Template.audienceDetails.helpers({

    subscribers: function() {
        return Subscribers.find({ serviceId: this._id }, { sort: { date: -1 } });
    }

});

Template.audienceDetails.events({

    'click #get-data': function() {
        Meteor.call('getAudienceSubscribersData', this._id);
    }

});
