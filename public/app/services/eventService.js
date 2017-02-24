angular.module("services")
	.factory("Event", ['$http', '$window', 'config', function($http, $window, config) {
		var eventFactory = {};

		// create a event
		eventFactory.create = function(eventData) {
			return $http.post(config.api_url + "/events/", eventData);
		};

		// update current event
		eventFactory.update = function(eventData) {			
			return $http.post(config.api_url + "/events/updateEvent", eventData);
		};

		// get events
		/*eventFactory.getEvents = function() {			
			return $http.post(config.api_url + "/events/get");
		};*/

		// get my events
		eventFactory.getMyEvents = function() {			
			return $http.get(config.api_url + "/events/getMyEvents");
		};

		// get pending events
		eventFactory.getPendingEvents = function() {			
			return $http.get(config.api_url + "/events/getPendingEvents");
		};

		// get upcoming events
		eventFactory.getUpcomingEvents = function() {			
			return $http.get(config.api_url + "/events/getUpcomingEvents");
		};

		// get events
		eventFactory.getEvent = function(id) {			
			return $http.post(config.api_url + "/events/getEvent", {event_id: id});
		};
		
		// cancel Event
		eventFactory.cancelEvent = function(id) {			
			return $http.post(config.api_url + "/events/cancelEvent", {event_id: id});
		};

		// accept Pending Event
		eventFactory.acceptEvent = function(idEvent) {			
			return $http.post(config.api_url + "/events/acceptEvent", {event_id: idEvent});
		};

		// reject Pending Event
		eventFactory.rejectEvent = function(idEvent,idUser) {			
			return $http.post(config.api_url + "/events/rejectEvent", {event_id: idEvent, user_id: idUser});
		};


		return eventFactory;
	}]);
