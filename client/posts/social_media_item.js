Template.socialMediaItem.helpers({

  formatMedia: function(media) {
  	if (media == 'Facebook') {
  		return "FB";
  	}
  	if (media == 'Facebook Page') {
  		return "FB Page";
  	}
  	else {
  		return media;
  	}
  },
  colorMedia: function(media) {
  	if (media == 'Facebook' || media == 'Facebook Page') {
  		return 'btn-primary';
  	}
  	if (media == 'Twitter') {
  		return 'btn-info';
  	}
  }

});