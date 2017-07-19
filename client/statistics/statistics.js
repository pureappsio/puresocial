Template.statistics.helpers({

    services: function() {
        return Services.find({ type: { $in: ['facebookPage', 'twitter', 'instagram'] } }, { sort: { name: 1 } });
    }

});
