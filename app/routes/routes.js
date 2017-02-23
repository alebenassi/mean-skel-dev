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

  usersRouter.get("/get", handlers.users.get);

  app.use("/api/users", usersRouter);

  var userRouter = express.Router();
  // With Token authentication
  userRouter.use(token_authentication);
  userRouter.put("/", handlers.users.updateCurrentUser);
  userRouter.post("/getUser", handlers.users.getUser);

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
  eventsRouter.get("/get", handlers.events.get); 

  app.use("/api/events", eventsRouter);  
  


};

exports.setup = setup;
