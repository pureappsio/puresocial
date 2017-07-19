Template.mediaItem.helpers({

    platform: function() {
        var type = Services.findOne(this._id).type;

        if (type == 'facebook') {
            return 'Facebook';
        }
        if (type == 'facebookGroup') {
            return 'Facebook Group';
        }
        if (type == 'pinterest') {
            return 'Pinterest';
        } else if (type == 'facebookPage') {
            return 'Facebook Page';
        } else {
            return 'Twitter';
        }
    },
    displayName: function() {

        return Services.findOne(this._id).name;

    }

});
