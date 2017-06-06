Template.serviceStats.events({

    // 'click .get-stats': function() {

    //     Meteor.call('getTwitterFollowers', this._id);

    // }

});

Template.serviceStats.helpers({

    followers: function() {
        return Stats.findOne({ type: 'followers', serviceId: this._id }).value;
    },
    clicks: function() {
        return Stats.find({ type: 'click', serviceId: this._id }).count();
    }

});
