getUserId = function() {

    if (Meteor.user().appUserId) {
        return Meteor.user().appUserId;
    } else {
        return Meteor.user()._id;
    }

}
