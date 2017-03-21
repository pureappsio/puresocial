Template.mediaItem.helpers({

    platform: function() {
        var type = Services.findOne(this._id).type;

        if (type == 'facebook') {
            return 'Facebook';
        }
        else if (type == 'facebookPage') {
            return 'Facebook Page';
        }
        else {
            return 'Twitter';
        }
    },
    displayName: function() {
        return Services.findOne(this._id).name;
    }

});