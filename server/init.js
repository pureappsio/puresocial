Meteor.startup(function () {

  // Start cron
  SyncedCron.start();

  // SMTP
  process.env.MAIL_URL = 'smtp://marcoschwartz:beyond08@smtp.sendgrid.net:587';

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

// // Whenever new user is created
// Accounts.onCreateUser(function(options, user) {
  
//   console.log('New user created');

//   // We still want the default hook's 'profile' behavior.
//   if (options.profile)
//     user.profile = options.profile;

//   console.log(user);

//   // Send welcome email
//   SSR.compileTemplate( 'htmlEmail', Assets.getText( 'welcome_email.html' ) );

//   var emailData = {
//     name: "Client Name"
//   };

//   // Send email
//   Email.send({
//       to: user.emails[0].address,
//       from: "SocialGear <contact@socialgear.io>",
//       subject: "Welcome to SocialGear!",
//       html: SSR.render( 'htmlEmail', emailData )
//     });

//   return user;
// });
