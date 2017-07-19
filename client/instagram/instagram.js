Template.instagram.events({

    'click #tag-search': function() {
        Meteor.call('mediaTagSearch', $('#tag').val());
    }

});
