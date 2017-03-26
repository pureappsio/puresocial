Template.audience.helpers({

    count: function() {
        return Subscribers.find({ serviceId: this._id }).fetch().length;
    }

});
