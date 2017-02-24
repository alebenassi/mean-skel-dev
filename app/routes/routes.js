var express = require("express");
var token_authentication = require("../middleware/auth");

function setup(app, handlers) {

// ########## Authentication Route ##########
  var authenticationRouter = express.Router();

  // Without authentication
  authenticationRouter.post("/authenticate", handlers.users.authenticate)

  app.use("/api/users", authenticationRouter);

  // ########## User Routes ##########
  var usersRouter = express.Router();

  // Without authentication
  usersRouter.post("/", handlers.users.createUser);
  usersRouter.post("/activate", handlers.users.activateAccount);  

  app.use("/api/users", usersRouter);

  var userRouter = express.Router();
  // With Token authentication
  userRouter.use(token_authentication);
  userRouter.put("/", handlers.users.updateCurrentUser);
  userRouter.get("/get", handlers.users.get);
  userRouter.post("/getUser", handlers.users.getUser);
  userRouter.post("/getEventUser", handlers.users.getEventUser);
  userRouter.get("/getActiveUsers", handlers.users.getActiveUsers);

  app.use("/api/user", userRouter);

// ########## More Routes ##########

// ########## Events Routes ##########
  
 var eventsRouter = express.Router();
  // With Token authentication
  eventsRouter.use(token_authentication);
  eventsRouter.post("/", handlers.events.createEvent)
  eventsRouter.post("/updateEvent", handlers.events.updateEvent)
  eventsRouter.post("/getEvent", handlers.events.getEvent); 
  eventsRouter.post("/cancelEvent", handlers.events.cancelEvent);
  eventsRouter.post("/acceptEvent", handlers.events.acceptEvent); 
  eventsRouter.post("/rejectEvent", handlers.events.rejectEvent); 
  //eventsRouter.post("/get", handlers.events.get); 
  eventsRouter.get("/getMyEvents", handlers.events.getMyEvents); 
  eventsRouter.get("/getPendingEvents", handlers.events.getPendingEvents); 
  eventsRouter.get("/getUpcomingEvents", handlers.events.getUpcomingEvents); 

  app.use("/api/events", eventsRouter);  
  


};

exports.setup = setup;
