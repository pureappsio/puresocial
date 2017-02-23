Meteor.startup(function() {

    // Start cron
    SyncedCron.start();

    // Allow delete users
    Meteor.users.allow({
        remove: function() {
            return true;
        }
    });

    // SMTP
    process.env.MAIL_URL = Meteor.settings.MAIL_URL;

    // Uploads
    UploadServer.init({
        tmpDir: process.env.PWD + '/.uploads/tmp',
        uploadDir: process.env.PWD + '/.uploads/',
        checkCreateDirectories: false,
        finished: function(fileInfo, formFields) {

            console.log(fileInfo);
            console.log(formFields);

        }
    })
});
