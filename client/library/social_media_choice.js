Template.socialMediaChoice.helpers({

    formatMedia: function() {
        if (this.type == 'facebook') {
            return "FB";
        } else if (this.type == 'facebookPage') {
            return "FB Page";

        } else if (this.type == 'facebookGroup') {
            return "FB Group";

        } else if (this.type == 'pinterest') {
            return "Pinterest";

        } 
        else if (this.type == 'instagram') {
            return "Instagram";

        } else {
            return 'Twitter';
        }
    },
    displayName: function() {
        if (this.type == 'facebookPage' || this.type == 'facebook' || this.type == 'facebookGroup') {
            return this.name;
        }
        if (this.type == 'pinterest') {
            return this.first_name;
        }
        if (this.type == 'instagram') {
            return this.name;
        }
        if (this.type == 'twitter') {
            return this.name;
        }
    },
    colorMedia: function(media) {
        if (this.type == 'facebookPage' || this.type == 'facebook' || this.type == 'facebookGroup') {
            return 'btn-primary';
        }
        if (this.type == 'pinterest') {
            return 'btn-danger';
        }
        if (this.type == 'instagram') {
            return 'btn-success';
        }
        if (this.type == 'twitter') {
            return 'btn-info';
        }
    }

});
