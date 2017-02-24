angular.module("controllers")
	.controller("eventCreateController", ['Event', 'Auth', '$location', 'flash','$scope', 'User', function(Event, Auth, $location, flash, $scope, User) {
    var vm = this;            
   
  	User.getActiveUsers().then(function(d) { 
    	$scope.guestList = d.data.users;    	
  	});

  	currentUser = Auth.getCurrentUser();
    $scope.currentId = currentUser._id;
  	
  	$scope.currentDate = new Date();
  	

    vm.saveEvent = function() {

      vm.processing = true;

      Event.create(vm.eventData).then(function(response) {
			flash.setMessage(response.data.message);
        	$location.path("/events");
      }, function(response) {      			
				flash.setMessage(response.data.message, "danger");
        		$location.path("/events");
		});
    };  
}])

  .controller("eventIndexController", ['Event', 'Auth', '$location', 'flash', 'config','$scope', function(Event, Auth, $location, flash, config, $scope) {
    
    currentUser = Auth.getCurrentUser();
    $scope.currentId = currentUser._id;

    Event.getMyEvents().then(function(d) {
      $scope.events = d.data.events;                    
    });

  }])


  .controller("eventEditController", ['Event', 'Auth', '$location', 'flash','$scope', 'User', '$routeParams', function(Event, Auth, $location, flash, $scope, User, $routeParams) {
    var vm = this;                    

    currentUser = Auth.getCurrentUser();
    $scope.currentId = currentUser._id;
    

    Event.getEvent($routeParams.event_id).then(function(d) {
    	$scope.event = d.data.event;    	                
    	var guestList = d.data.event.guestList;
    	var arrGuest = new Array();    	          
    	guestList.forEach(function(guest) {    		        
    		User.getEventUser(guest._id).then(function(u){
    			var g = new Object;
    			g['firstname'] = u.data.user.firstname;
    			g['lastname'] = u.data.user.lastname;
    			g['accepted'] = guest.accepted    			    			
    			arrGuest.push(g);    			

    		});
    		
    	});

    	$scope.guestList = arrGuest;
  	});
    

    $scope.saveEvent = function(data) {                  
      vm.processing = true;

      Event.update(data).then(function(response) {
      flash.setMessage(response.data.message);
          $location.path("/events");
      }, function(response) {           
        flash.setMessage(response.data.message, "danger");
            $location.path("/events");
     });
    };  
}])



.controller("eventCancelController", ['Event', 'Auth', '$location', 'flash','$scope', '$routeParams', function(Event, Auth, $location, flash, $scope, $routeParams) {  
    Event.cancelEvent($routeParams.event_id).then(function(response) {      
      flash.setMessage(response.data.message);
          $location.path("/events");
      }, function(response) {           
        flash.setMessage(response.data.message, "danger");
            $location.path("/events");
     });    
}])

 .controller("pendingEventController", ['Event', 'Auth', '$location', 'flash','$scope', '$routeParams','User', function(Event, Auth, $location, flash, $scope, $routeParams, User) {

    currentUser = Auth.getCurrentUser();    
    $scope.currentId = currentUser._id;    
    
    Event.getPendingEvents().then(function(d) {
    	$scope.events = d.data.events;    	
    	$scope.events.forEach(function (event){    		
    		User.getEventUser(event.user).then(function(u){
    			event.userFirstname=u.data.user.firstname;
    			event.userLastname=u.data.user.lastname;
    		});
    	});    	      
  	});    
}])


 .controller("eventAcceptController", ['Event', 'Auth', '$location', 'flash','$scope', '$routeParams', function(Event, Auth, $location, flash, $scope, $routeParams) {  
      
    Event.acceptEvent($routeParams.event_id).then(function(response) {

      flash.setMessage(response.data.message);      
          $location.path("/pending");
      }, function(response) {           
        flash.setMessage(response.data.message, "danger");
            $location.path("/pending");
     });    
}])

 .controller("eventRejectController", ['Event', 'Auth', '$location', 'flash','$scope', '$routeParams', function(Event, Auth, $location, flash, $scope, $routeParams) {  
    Event.rejectEvent($routeParams.event_id).then(function(response) {    

      flash.setMessage(response.data.message);      
          $location.path("/pending");
      }, function(response) {           
        flash.setMessage(response.data.message, "danger");
            $location.path("/pending");
     });    
}])

 .controller("upcomingEventController", ['Event', 'Auth', '$location', 'flash','$scope', '$routeParams','User', function(Event, Auth, $location, flash, $scope, $routeParams, User) {
   
    currentUser = Auth.getCurrentUser();    
  

    Event.getUpcomingEvents().then(function(d) {
    	$scope.events = d.data.events;    	
    	$scope.events.forEach(function (event){    		
    		User.getEventUser(event.user).then(function(u){
    			event.userFirstname=u.data.user.firstname;
    			event.userLastname=u.data.user.lastname;
    		});
    	});    	      
  	});   

	     
}])



