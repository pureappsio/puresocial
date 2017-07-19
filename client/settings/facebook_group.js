Template.facebookGroup.events({

    'click .add-page': function(event, template) {

        // Log
        console.log(template.data);

        // Add profile to user profile
        Meteor.call('userAddFacebookGroup', template.data);
    }

});

Template.facebookGroup.helpers({

    isSelected: function() {

        if (Services.findOne({ id: this.id })) {
            return true;
        } else {
            return false;
        }

    }

});
