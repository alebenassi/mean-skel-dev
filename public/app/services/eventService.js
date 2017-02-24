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
		eventFactory.getEvents = function(filters) {			
			return $http.post(config.api_url + "/events/get", {filters: filters});
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
		eventFactory.acceptEvent = function(idEvent,idUser) {			
			return $http.post(config.api_url + "/events/acceptEvent", {event_id: idEvent, user_id: idUser});
		};

		// reject Pending Event
		eventFactory.rejectEvent = function(idEvent,idUser) {			
			return $http.post(config.api_url + "/events/rejectEvent", {event_id: idEvent, user_id: idUser});
		};


		return eventFactory;
	}]);
