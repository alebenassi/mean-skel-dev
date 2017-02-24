angular.module("services")
	.factory("User", ['$http', '$window', 'config', function($http, $window, config) {
		var userFactory = {};

		// create a user
		userFactory.create = function(userData) {
			return $http.post(config.api_url + "/users/", userData);
		};

		// update current user
		userFactory.update = function(userData) {
			return $http.put(config.api_url + "/user/", userData);
		};

		// activate account
		userFactory.activateAccount = function(userData) {
			return $http.post(config.api_url + "/users/activate/", userData);
		};

		// get users
		userFactory.getUsers = function(filters) {
			return $http.post(config.api_url + "/user/get", {filters:filters});
		};

		// get user
		userFactory.getUser = function(id, select) {
			return $http.post(config.api_url + "/user/getUser", {user_id: id, select: select});
		};


		return userFactory;
	}]);
