angular.module("app.routes", ["ngRoute"])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when("/home", {
        templateUrl: "app/views/pages/home.html",
        authenticate: false
      })

      .when("/signup", {
        templateUrl: "app/views/users/new.html",
        controller: "userCreateController",
        controllerAs: "user",
        authenticate: false
      })

      .when("/login", {
        templateUrl: "app/views/pages/login.html",
        controller: "mainController",
        controllerAs: "login",
        authenticate: false
      })

      .when("/user", {
        templateUrl: "app/views/users/edit.html",
        controller: "userEditController",
        controllerAs: "user",
        authenticate: true
      })

      .when("/activate/:activation_token", {
        templateUrl: "app/views/users/activate.html",
        controller: "userActivationController",
        controllerAs: "user",
        authenticate: false
      })

      /* EVENTS */
      .when("/events", {
        templateUrl: "app/views/events/index.html",
        controller: "eventIndexController",
        controllerAs: "event",
        authenticate: true
      })      

      .when("/new-event", {
        templateUrl: "app/views/events/new.html",
        controller: "eventCreateController",
        controllerAs: "event",
        authenticate: true
      }) 

      .when("/event/:event_id", {
        templateUrl: "app/views/events/edit.html",
        controller: "eventEditController",
        controllerAs: "event",
        authenticate: true
      })

      .when("/cancel-event/:event_id", {
        templateUrl: "app/views/events/cancel.html",
        controller: "eventCancelController",
        controllerAs: "event",
        authenticate: true
      })    

      .when("/accept-event/:event_id/:user_id", {
        templateUrl: "app/views/events/accept.html",
        controller: "eventAcceptController",
        controllerAs: "event",
        authenticate: true
      })  

      .when("/reject-event/:event_id/:user_id", {
        templateUrl: "app/views/events/reject.html",
        controller: "eventRejectController",
        controllerAs: "event",
        authenticate: true
      })  

      /*AGENDA*/



      /*PENDING*/
      .when("/pending", {
        templateUrl: "app/views/pending/index.html",
        controller: "pendingEventController",
        controllerAs: "event",
        authenticate: true
      })

      /*UPCOMING*/
      .when("/upcoming", {
        templateUrl: "app/views/upcoming/index.html",
        controller: "upcomingEventController",
        controllerAs: "event",
        authenticate: true
      })

      .otherwise({
          redirectTo: '/home'
      });

    $locationProvider.html5Mode(true);
  }])
