Template.audiences.helpers({

    audiences: function() {
        return Services.find({ bot: 'on' });
    }

});
