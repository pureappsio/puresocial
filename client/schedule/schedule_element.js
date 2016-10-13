Template.scheduleElement.events({

	'click #save-schedule': function(event, template) {

      // Get value of elements
      var hour = $('#' + template.data.name + '-hour-choice').find(":selected").text();
      var period = $('#' + template.data.name + '-period-choice').find(":selected").text();
      var days_data = $("." + template.data.name + "-day-choice:input:checked");
      var days = [];
      for (var i = 0; i < days_data.length; i++) {
        days.push(days_data[i].value);
      }

      // Build post object
      var schedule = {};
      schedule.hour = hour;
      schedule.period = period;
      schedule.days = days;
      schedule.category = template.data.name;

      // Store in DB
      //console.log(schedule);
      Meteor.call('updateSchedule', schedule);

    }

});

Template.scheduleElement.rendered = function() {

  // Load schedule
  Meteor.call('getSchedule', this.data.name, function (error, data) {

    // console.log(data);

    // Load days
    var checkboxes = $("." + data.category + "-day-choice:input");

    for (var i = 0; i < data.days.length; i++) {

      var dayNumber = getDayNumber(data.days[i]);
      var theCheckBox = $(checkboxes[dayNumber]);
      theCheckBox.attr('checked', true);

    }

    // Load time
    $('#' + data.category + '-hour-choice').val(data.hour);
    if (data.period == 'AM') {
      $('#' + data.category + '-period-choice').val('am');
    }
    if (data.period == 'PM') {
      $('#' + data.category + '-period-choice').val('pm');
    }

  });

};

function getDayNumber(dayString) {

  var dayNumber = 0;
  if (dayString == 'Monday') {
    dayNumber = 0;
  }
  if (dayString == 'Tuesday') {
    dayNumber = 1;
  }
  if (dayString == 'Wednesday') {
    dayNumber = 2;
  }
  if (dayString == 'Thursday') {
    dayNumber = 3;
  }
  if (dayString == 'Friday') {
    dayNumber = 4;
  }
  if (dayString == 'Saturday') {
    dayNumber = 5;
  }
  if (dayString == 'Sunday') {
    dayNumber = 6;
  }

  return dayNumber;
}
