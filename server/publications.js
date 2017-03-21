if(Meteor.isServer) {
	Meteor.publish("userData", function () {
	  return Meteor.users.find({_id: this.userId}, {services: {twitter: 1, facebook: 1}});
	});

	Meteor.publish("userPosts", function () {
	  return Posts.find({userId: this.userId});
	});

	Meteor.publish("userQueue", function () {
	  return Queues.find({userId: this.userId});
	});

	Meteor.publish("userSchedule", function () {
	  return Schedules.find({userId: this.userId});
	});

	Meteor.publish("userServices", function () {
	  return Services.find({userId: this.userId});
	});

	Meteor.publish("userAutomations", function () {
	  return Automations.find({userId: this.userId});
	});
}
