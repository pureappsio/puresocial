Template.socialMediaChoice.helpers({

    formatMedia: function() {
        if (this.type == 'facebook') {
            return "FB";
        } else if (this.type == 'facebookPage') {
            return "FB Page";
        } else {
            return 'Twitter';
        }
    },
    displayName: function() {
       if (this.type == 'facebookPage' || this.type == 'facebook') {
            return this.name;
        }
        if (this.type == 'twitter') {
            return this.name;
        }
    },
    colorMedia: function(media) {
        if (this.type == 'facebookPage' || this.type == 'facebook') {
            return 'btn-primary';
        }
        if (this.type == 'twitter') {
            return 'btn-info';
        }
    }

});
