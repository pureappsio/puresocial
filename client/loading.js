var Spinner = require('spin');

Template.loading.onRendered(function() {

    var target = document.getElementById('spinner')
    var spinner = new Spinner({}).spin(target);

});
