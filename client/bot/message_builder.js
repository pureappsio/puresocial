Template.messageBuilder.onRendered(function() {

    buttonIndex = 0;

});

Template.messageBuilder.events({

    'click #type, change #type': function() {

        var selection = $('#type :selected').val();

        $('#broadcast-content').empty();
        $('.img-broadcast').hide();

        if (selection == 'text') {

            $('#broadcast-content').append("<textarea class='action form-control' placeholder='Message...' id='broadcast-text' rows='4' cols='50'></textarea>");

        }
        if (selection == 'video') {

            $('#broadcast-content').append("<input placeholder='Video url...' class='action form-control' id='video-url'>");

        }
        if (selection == 'buttons') {

            buttonIndex = 0;

            content = "<textarea class='action form-control' placeholder='Message...' id='broadcast-text' rows='2' cols='50'></textarea>";
            content += "<div id='button-row'>";
            content += "<div class='row'><div class='col-md-5'><input placeholder='Button text...' class='action form-control' id='button-text-0'></div><div class='col-md-5'><input placeholder='Button url...' class='action form-control' id='button-url-0'></div>";
            content += "<div class='col-md-1'><button id='add-button' class='btn btn-secondary'>+</button></div>";
            content += "</div>";
            content += "</div>";
            $('#broadcast-content').append(content);
        }

        if (selection == 'generic') {

            buttonIndex = -1;

            content = "<div class='row'><div class='col-md-12'><input type='text' class='action form-control' placeholder='Title...' id='broadcast-title'></div></div>";
            content += "<div class='row'><div class='col-md-12'><input type='text' class='action form-control' placeholder='Subtitle...' id='broadcast-subtitle'></div></div>";
            content += "<div class='row'><div class='col-md-12'><input type='text' class='action form-control' placeholder='Default action link...' id='default-action'></div></div>";
            content += "<div id='button-row'>";
            content += "<div class='row'><div class='col-md-12'><button id='add-button' class='btn btn-block btn-secondary'>Add Button</button></div></div>";
            content += "</div>";
            content += "</div>";
            $('#broadcast-content').append(content);

            $('.img-broadcast').show();
        }

    },
    'click #add-button': function() {

        buttonIndex++;
        console.log(buttonIndex);

        $('#button-row').append("<div class='row'><div class='col-md-5'><input placeholder='Button text...' class='form-control' id='button-text-" + buttonIndex + "'></div><div class='col-md-5'><input placeholder='Button url...' class='form-control' id='button-url-" + buttonIndex + "'></div></div>");

    },
    'mouseup .action, keyup .action, change .action, click .action': function() {

        var messageData = {};

        var selection = $('#type :selected').val();

        // Type
        messageData.type = selection;

        if (selection == 'text') {
            messageData.message = $('#broadcast-text').val();
        }

        if (selection == 'video') {
            messageData.videoUrl = $('#video-url').val();
        }

        if (selection == 'buttons') {

            messageData.message = $('#broadcast-text').val();

            buttons = [];
            for (i = 0; i <= buttonIndex; i++) {
                var button = {};
                button.type = "web_url";
                button.title = $('#button-text-' + i).val();
                button.url = $('#button-url-' + i).val();
                buttons.push(button);
            }

            messageData.buttons = buttons;

        }

        if (selection == 'generic') {

            messageData.title = $('#broadcast-title').val();
            if ($('#broadcast-subtitle').val() != "") {
                messageData.subtitle = $('#broadcast-subtitle').val();
            }
            if ($('#default-action').val() != "") {
                messageData.default_action = $('#default-action').val();
            }

            if (Session.get('messagePicture')) {
                messageData.image_url = Images.findOne(Session.get('messagePicture')).link();
            }

            if (buttonIndex != -1) {
                buttons = [];
                for (i = 0; i <= buttonIndex; i++) {
                    var button = {};
                    button.type = "web_url";
                    button.title = $('#button-text-' + i).val();
                    button.url = $('#button-url-' + i).val();
                    buttons.push(button);
                }

                messageData.buttons = buttons;
            }

        }

        console.log(messageData);
        Session.set('messageData', messageData);

    }

});
