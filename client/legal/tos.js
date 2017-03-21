Template.tos.helpers({

    date: function() {

        return moment(new Date()).format('MMMM Do YYYY');

    },
    url: function() {
        return Meteor.absoluteUrl();
    },
    company: function() {
        return 'PureSocial';
    }

});
