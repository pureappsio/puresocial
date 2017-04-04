Template.uploadForm.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
    currentUpload: function() {
        return Template.instance().currentUpload.get();
    }

});

Template.uploadForm.events({

    'change #fileInput': function(e, template) {

        if (this.imageId) {
            var imageId = this.imageId;
        } else {
            var imageId = "";
        }

        if (e.currentTarget.files && e.currentTarget.files[0]) {
            // We upload only one file, in case
            // multiple files were selected
            var upload = Images.insert({
                file: e.currentTarget.files[0],
                streams: 'dynamic',
                chunkSize: 'dynamic',
                transport: 'http'
            }, false);

            upload.on('start', function() {
                template.currentUpload.set(this);
            });

            upload.on('end', function(error, fileObj) {
                if (error) {
                    console.log('Error during upload: ' + error);
                } else {
                    console.log('File "' + fileObj.name + '" successfully uploaded');
                    console.log(fileObj);
                    if (imageId != "") {
                        Session.set(imageId, fileObj._id);
                        Session.set(imageId + 'Length', fileObj.size);
                        Session.set(imageId + 'Link', '/cdn/storage/Images/' + fileObj._id + '/original/' + fileObj._id + '.' + fileObj.ext);
                    } else {
                        Session.set('fileId', fileObj._id);
                        Session.set('imgLink', '/cdn/storage/Images/' + fileObj._id + '/original/' + fileObj._id + '.' + fileObj.ext);
                    }


                }
                template.currentUpload.set(false);
            });

            upload.start();
        }
    }
});
