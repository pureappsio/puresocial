Template.facebookPageItem.events({

    'click .delete': function() {

        // Store in DB
        Meteor.call('deleteFacebookPage', this._id);

    },
    'click .bot': function() {

        if (this.bot) {

            if (this.bot == 'on') {
                Meteor.call('unSubscribePage', this._id);
            }
            else if (this.bot == 'off') {
                Meteor.call('subscribePage', this._id);
            }

        } else {
            Meteor.call('subscribePage', this._id);
        }

    }

});

Template.facebookPageItem.helpers({

    botName: function() {

        if (this.bot) {

            if (this.bot == 'on') {
                return 'Bot ON';
            }
            if (this.bot == 'off') {
                return 'Bot OFF';

            }
        } else {
            return 'Bot OFF';
        }

    },
    botColor: function() {

        if (this.bot) {

            if (this.bot == 'on') {
                return 'primary';
            }
            if (this.bot == 'off') {
                return 'danger';

            }
        } else {
            return 'danger';
        }

    }

});
