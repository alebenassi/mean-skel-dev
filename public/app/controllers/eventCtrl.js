angular.module("controllers")
	.controller("eventCreateController", ['Event', 'Auth', '$location', 'flash','$scope', 'User', function(Event, Auth, $location, flash, $scope, User) {
    var vm = this;            
	User.getUsers().then(function(d) { 
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
  	Event.getEvents().then(function(d) {
    	$scope.events = d.data.events;    	        
      //$scope.events.date = new Date(d.data.events.date);          
  	});

	  currentUser = Auth.getCurrentUser();
    $scope.currentId = currentUser._id;

    $scope.currentDate = new Date();
    $scope.currentDate.toISOString();    
    


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
    		User.getUser(guest._id).then(function(u){
    			var g = new Object;
    			g['firstname'] = u.data.user.firstname;
    			g['lastname'] = u.data.user.lastname;
    			g['accepted'] = guest.accepted    			
    			//arrGuest.push(guest.accepted);
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
      //TODO SEND MAIL
      flash.setMessage(response.data.message);
          $location.path("/events");
      }, function(response) {           
        flash.setMessage(response.data.message, "danger");
            $location.path("/events");
     });    
}])

 .controller("pendingEventController", ['Event', 'Auth', '$location', 'flash','$scope', '$routeParams','User', function(Event, Auth, $location, flash, $scope, $routeParams, User) {
   
    
    Event.getEvents().then(function(d) {
    	$scope.events = d.data.events;    	
    	$scope.events.forEach(function (event){    		
    		User.getUser(event.user).then(function(u){
    			event.userFirstname=u.data.user.firstname;
    			event.userLastname=u.data.user.lastname;
    		});
    	});    	
      //$scope.events.date = new Date(d.data.events.date);          
  	});

    currentUser = Auth.getCurrentUser();
    $scope.currentId = currentUser._id;


    $scope.search = function (event) {    	    
	    var found = false;
	    angular.forEach(event.guestList, function (guest) {          		    	    
	    	if (guest._id == currentUser._id && guest.accepted == 0)	        
	        found = true;
	    });


	    return found;
	};	


    $scope.currentDate = new Date();
    $scope.currentDate.toISOString();    
}])


 .controller("eventAcceptController", ['Event', 'Auth', '$location', 'flash','$scope', '$routeParams', function(Event, Auth, $location, flash, $scope, $routeParams) {  
    Event.acceptEvent($routeParams.event_id, $routeParams.user_id).then(function(response) {
      //TODO SEND MAIL

      flash.setMessage(response.data.message);      
          $location.path("/pending");
      }, function(response) {           
        flash.setMessage(response.data.message, "danger");
            $location.path("/pending");
     });    
}])

 .controller("eventRejectController", ['Event', 'Auth', '$location', 'flash','$scope', '$routeParams', function(Event, Auth, $location, flash, $scope, $routeParams) {  
    Event.rejectEvent($routeParams.event_id, $routeParams.user_id).then(function(response) {
      //TODO SEND MAIL

      flash.setMessage(response.data.message);      
          $location.path("/pending");
      }, function(response) {           
        flash.setMessage(response.data.message, "danger");
            $location.path("/pending");
     });    
}])

 .controller("upcomingEventController", ['Event', 'Auth', '$location', 'flash','$scope', '$routeParams','User', function(Event, Auth, $location, flash, $scope, $routeParams, User) {
   
    
    Event.getEvents().then(function(d) {
    	$scope.events = d.data.events;    	
    	$scope.events.forEach(function (event){    		
    		User.getUser(event.user).then(function(u){
    			event.userFirstname=u.data.user.firstname;
    			event.userLastname=u.data.user.lastname;
    		});
    	});    	
      //$scope.events.date = new Date(d.data.events.date);          
  	});

    currentUser = Auth.getCurrentUser();
    $scope.currentId = currentUser._id;


    $scope.search = function (event) {    	    
	    var found = false;
	    if (event.user == currentUser._id) {
	    	found = true;
	    } else {
		    angular.forEach(event.guestList, function (guest) {          		    	    
		    	if (guest._id == currentUser._id && guest.accepted == 1)	        
		        found = true;
		    });
		 }


	    return found;
	};	


    $scope.currentDate = new Date();
    $scope.currentDate.toISOString();    
}])



