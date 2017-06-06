Template.statistics.helpers({

    services: function() {
        return Services.find({ type: { $in: ['facebookPage', 'twitter'] } }, { sort: { name: 1 } });
    }

});
