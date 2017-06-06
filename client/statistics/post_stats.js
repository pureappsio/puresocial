Template.postStats.helpers({

    clicks: function() {
        return Stats.find({ type: 'click', postId: this._id, serviceId: this.serviceId }).count();
    }

});
