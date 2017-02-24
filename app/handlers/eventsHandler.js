var jwt = require("jsonwebtoken"),
  config = require("../../config").config(),
  errors = require("../helpers/errors"),
  mailer = require("../helpers/mailer"),
  User = require("../models/user"),
  Event = require("../models/event");

var secret_token = config.secret;


/**
 * @api {post} /api/events Update new event
 * @apiName event_update
 * @apiGroup Events
 * @apiVersion 0.1.0
 *
 * @apiParam {String} email Event title
 * @apiParam {String} password Event description

 
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 201 Updated
 *    {
 *      token:  "12345abcdef",
 *      event: {
 *        _id: event._id, 
 *        title: "title",
 *        description: "description"
 *      }
 *    }
 *
 *
 * @apiError CantEditEvent Can't update event
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1000500,
 *      message: "Can't edit event.",
 *      detail: {},
 *      errors: []
 *    }
 *
 *
 */
function createEvent(req, res){
  var event = new Event();
  event.title = req.body.title;
  event.description = req.body.description;
  event.date = new Date(req.body.date);  
  event.user = req.current_user._id;

  req.body.guestList.forEach(function(userId){
    event.guestList.push(userId);   
  });
  
  event.save(function(err){        
    if (err) {            
        return res.status(400).json(errors.newError(errors.errorsEnum.CantCreateEvent, err));
    }    
    req.body.guestList.forEach(function(userId){    
      User
      .findOne({_id : userId})          
      .exec(function(err, user){
          if (err){
            return res.status(400).send(errors.newError(errors.errorsEnum.CantSendMail, err))
          }
          if (!user) {
            return res.status(401).json(errors.newError(errors.errorsEnum.CantSendMail));
          }       
           mailer.sendInvitationEmail(user,event, function(error){
            // TODO: Handle error if exists

          });

        });
    });  



    res.status(201).json({
      message: "Event created!",
      Event: event.asJson()
    });
  });
}

/**
 * @api {get} /api/event/get Get events
 * @apiName event_get
 * @apiGroup Events
 * @apiVersion 0.1.0
 * 
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 200 OK
 *    {
 *      message:  "Events Get."
 *    }
 *
 * @apiError CantGetEvent There was a problem at getting events
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1000700,
 *      message: "There was a problem at getting events.",
 *      detail: {},
 *      errors: []
 *    }
 *
 */
/*function get(req, res) {     
   Event.get(function(err, events){
      if (err){
        return res.status(400).send(errors.newError(errors.errorsEnum.CantGetEvent, err))
      }
      if (!events) {
        return res.status(401).json(errors.newError(errors.errorsEnum.CantGetEvent));
      }       
      
     res.json({
        message: "Events get.",
        events: events
      });

	
    });
}*/

/**
 * @api {get} /api/events/getMyEvents Get my events
 * @apiName event_get_my_events
 * @apiGroup Events
 * @apiVersion 0.1.0
 * 
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 200 OK
 *    {
 *      message:  "My Events Get."
 *    }
 *
 * @apiError CantGetMyEvents There was a problem at getting my events
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1005000,
 *      message: "There was a problem at getting my events.",
 *      detail: {},
 *      errors: []
 *    }
 *
 */
function getMyEvents(req, res) {     
   Event.getMyEvents(req.current_user, function(err, events){
      if (err){
        return res.status(400).send(errors.newError(errors.errorsEnum.CantGetMyEvents, err))
      }
      if (!events) {
        return res.status(401).json(errors.newError(errors.errorsEnum.CantGetMyEvents));
      }       
      
     res.json({
        message: "My Events get.",
        events: events
      });

    });
}

/**
 * @api {get} /api/events/getPendingEvents Get pending events
 * @apiName event_get_pending_events
 * @apiGroup Events
 * @apiVersion 0.1.0
 * 
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 200 OK
 *    {
 *      message:  "Pending Events Get."
 *    }
 *
 * @apiError CantGetPendingEvents There was a problem at getting pending events
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1007000,
 *      message: "There was a problem at getting pending events.",
 *      detail: {},
 *      errors: []
 *    }
 *
 */
function getPendingEvents(req, res) {     
   Event.getPendingEvents(req.current_user, function(err, events){
      if (err){
        return res.status(400).send(errors.newError(errors.errorsEnum.CantGetPendingEvents, err))
      }
      if (!events) {
        return res.status(401).json(errors.newError(errors.errorsEnum.CantGetPendingEvents));
      }       
      
     res.json({
        message: "Pending Events get.",
        events: events
      });

    });
}

/**
 * @api {get} /api/events/getUpcomingEvents Get upcoming events
 * @apiName event_get_pending_events
 * @apiGroup Events
 * @apiVersion 0.1.0
 * 
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 200 OK
 *    {
 *      message:  "Upcoming Events Get."
 *    }
 *
 * @apiError CantGetUpcomingEvents There was a problem at getting upcoming events
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1007000,
 *      message: "There was a problem at getting upcoming events.",
 *      detail: {},
 *      errors: []
 *    }
 *
 */
function getUpcomingEvents(req, res) {     
   Event.getUpcomingEvents(req.current_user, function(err, events){
      if (err){
        return res.status(400).send(errors.newError(errors.errorsEnum.CantGetUpcomingEvents, err))
      }
      if (!events) {
        return res.status(401).json(errors.newError(errors.errorsEnum.CantGetUpcomingEvents));
      }       
      
     res.json({
        message: "Upcoming Events get.",
        events: events
      });

    });
}


/**
 * @api {post} /api/events/getEvent Get events
 * @apiName eventGet
 * @apiGroup Events
 * @apiVersion 0.1.0
 * 
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 200 OK
 *    {
 *      message:  "Events Get."
 *    }
 *
 * @apiError CantGetEvent There was a problem at getting event
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1000700,
 *      message: "There was a problem at getting events.",
 *      detail: {},
 *      errors: []
 *    }
 *
 *
 * @apiError InvalidAuthorizationGetEvent There was a problem at getting event
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1000701,
 *      message: "Invalid authorization, you can't get event.",
 *      detail: {},
 *      errors: []
 *    }
 *
 *
 * @apiError CantGetEventCancelled There was a problem at getting event
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1000702,
 *      message: "Can't get event that has already been cancelled.",
 *      detail: {},
 *      errors: []
 *    }
 *
 */
function getEvent(req, res) {    
   Event.findOne({ _id: req.body.event_id, user: req.current_user._id }).exec(function(err, event){
    if (err){
        return res.status(400).send(errors.newError(errors.errorsEnum.CantGetEvent, err))
      }
      if (!event) {
        res.status(401).json(errors.newError(errors.errorsEnum.InvalidAuthorizationGetEvent));
      } else {
        if (!event.active) {
            res.status(401).json(errors.newError(errors.errorsEnum.CantGetEventCancelled));
        } else {
         Event.getEvent(req.body.event_id, function(err, event) {
         	if (err){
              return res.status(400).send(errors.newError(errors.errorsEnum.CantGetEvent, err))
            }
            if (!event) {
              return res.status(401).json(errors.newError(errors.errorsEnum.CantGetEvent));
            }       
            res.json({
              message: "Event get.",
              event: event.asJson()
            });
         });
       }
     }
   });
}

/**
 * @api {post} /api/events/updateEvent updateEvent
 * @apiName updateEvent
 * @apiGroup Events
 * @apiVersion 0.1.0
 * 
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 200 OK
 *    {
 *      message:  "Event Update."
 *    }
 *
 * @apiError CantUpdateEvent There was a problem at updating events
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1000800,
 *      message: "There was a problem at updating events.",
 *      detail: {},
 *      errors: []
 *    }
 *
 *
* @apiError InvalidAuthorizationUpateEvent There was a problem at updating event
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1000801,
 *      message: "Invalid authorization, you can't update event",
 *      detail: {},
 *      errors: []
 *    }
 *
 *
 * @apiError CantUpdateEventCancelled There was a problem at updating events
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1000802,
 *      message: "Can't update event cancelled.",
 *      detail: {},
 *      errors: []
 *    }
 *
 */
function updateEvent(req, res) {  
  Event.findOne({ _id: req.body._id, user: req.current_user._id }).exec(function(err, event){
    if (err){
        return res.status(400).send(errors.newError(errors.errorsEnum.CantUpdateEvent, err))
      }
      if (!event) {
        res.status(401).json(errors.newError(errors.errorsEnum.InvalidAuthorizationUpateEvent));
      } else {
        if (!event.active) {
            res.status(401).json(errors.newError(errors.errorsEnum.CantUpdateEventCancelled));
        } else {
          event.title = req.body.title;
          event.description = req.body.description;          
          event.save(function(err, eventUpdated) {
          //Event.updateEvent(req.body._id,req.body.title,req.body.description, function(err, eventUpdated){
          	if (err) {            
                return res.status(400).json(errors.newError(errors.errorsEnum.CantUpdateEvent, err));
            }    
            res.status(201).json({
              message: "Event updated!",
              event: eventUpdated.asJson()
            });
          });
        }
     } 
  });

}


/**
 * @api {post} /api/events/cancelEvent cancelEvent
 * @apiName cancelEvent
 * @apiGroup Events
 * @apiVersion 0.1.0
 * 
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 200 OK
 *    {
 *      message:  "Event Cancelled."
 *    }
 *
 * @apiError CantCancelEvent There was a problem at cancelling event
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1001000,
 *      message: "There was a problem at cancelling events.",
 *      detail: {},
 *      errors: []
 *    }
 *
 *
 * @apiError InvalidAuthorizationCancelEvent There was a problem at cancelling event
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1001001,
 *      message: "Invalid authorization, you can't cancel event.",
 *      detail: {},
 *      errors: []
 *    }
 *
 *
 * @apiError CantCancelEventCancelled There was a problem at cancelling events
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1001002,
 *      message: "Can't cancel event that has already been cancelled.",
 *      detail: {},
 *      errors: []
 *    }
 *
 */
function cancelEvent(req, res) {    
  Event.findOne({ _id: req.body.event_id, user: req.current_user._id }).exec(function(err, event){
     if (err){
        return res.status(400).send(errors.newError(errors.errorsEnum.CantCancelEvent, err))
      }
      if (!event) {
        res.status(401).json(errors.newError(errors.errorsEnum.InvalidAuthorizationCancelEvent));
      } else {
        if (!event.active) {
            res.status(401).json(errors.newError(errors.errorsEnum.CantCancelEventCancelled));
        } else {
          //event.active = false;
          //event.save(function(err, eventUpdated) {
          Event.cancelEvent(event._id, function(err, eventUpdated){
          if (err) {            
              return res.status(400).json(errors.newError(errors.errorsEnum.CantCancelEvent, err));
          }    
          eventUpdated.guestList.forEach(function(user){    
            if (user.accepted != 2) {  //If the user cancel, dont send mail
              User.getUser(user._id, function(err, user){
                  if (err){
                    return res.status(400).send(errors.newError(errors.errorsEnum.CantSendMail, err))
                  }
                  if (!user) {
                    return res.status(401).json(errors.newError(errors.errorsEnum.CantSendMail));
                  }       
                   mailer.cancelEventEmail(user,eventUpdated, function(error){
                    // TODO: Handle error if exists

                  });

                });
            }
          });

          res.status(201).json({
            message: "Event Cancelled!",
            event: eventUpdated.asJson()
            });
          });        
        }
      }
  });  
}


/**
 * @api {post} /api/events/acceptEvent acceptEvent
 * @apiName acceptEvent
 * @apiGroup Events
 * @apiVersion 0.1.0
 * 
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 200 OK
 *    {
 *      message:  "Event Accepted."
 *    }
 *
 * @apiError CantAcceptEvent There was a problem at accepting events
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1002000,
 *      message: "There was a problem at accepting events.",
 *      detail: {},
 *      errors: []
 *    }
 *
 *
* @apiError InvalidAuthorizationAcceptEvent There was a problem at accepting event
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1002001,
 *      message: "Invalid authorization, you can't accept event without invitation.",
 *      detail: {},
 *      errors: []
 *    }
 *
 *
 * @apiError CantAcceptEventCancelled There was a problem at accepting events
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1002002,
 *      message: "Can't accept invitation to an event that has already been cancelled.",
 *      detail: {},
 *      errors: []
 *    }
 *
 */
function acceptEvent(req, res) {    

  Event.findOne({ _id: req.body.event_id, guestList: {_id: req.current_user._id, accepted: 0}}).exec(function(err, event){
    if (err){
        return res.status(400).send(errors.newError(errors.errorsEnum.CantAcceptEvent, err))
      }
      if (!event) {
        res.status(401).json(errors.newError(errors.errorsEnum.InvalidAuthorizationAcceptEvent));
      } else {
        if (!event.active) {
            res.status(401).json(errors.newError(errors.errorsEnum.CantAcceptEventCancelled));
        } else {          
          Event.acceptEvent(req.body.event_id, req.current_user._id, function(err, eventUpdated){
          	if (err) {            
               return res.status(400).json(errors.newError(errors.errorsEnum.CantAcceptEvent, err));
            }    
            //First, I get the user who accepted the invitation, second i get the event's user.
            User.getUser(req.current_user._id, function(err, userAccept){    
                if (err){
                    return res.status(400).send(errors.newError(errors.errorsEnum.CantSendMail, err))
                }
                if (!userAccept) {
                    return res.status(401).json(errors.newError(errors.errorsEnum.CantSendMail));
                }       
                User.getUser(eventUpdated.user, function(err,userEvent){
                    if (err){
                        return res.status(400).send(errors.newError(errors.errorsEnum.CantSendMail, err))
                    }
                    if (!userEvent) {
                        return res.status(401).json(errors.newError(errors.errorsEnum.CantSendMail));
                    }       
                    mailer.acceptInvitationEmail(userAccept,userEvent, eventUpdated, function(error){                
                     // TODO: Handle error if exists
                    });
                });
            });
             

            res.status(201).json({
              message: "Invitation Accepted!",
              event: eventUpdated.asJson()
            });
         });  
        }
      }            
  });
}


/**
 * @api {post} /api/events/rejectEvent rejectEvent
 * @apiName rejectEvent
 * @apiGroup Events
 * @apiVersion 0.1.0
 * 
 *
 * @apiSuccessExample Success-Response
 *    HTTP/1.1 200 OK
 *    {
 *      message:  "Event Rejected."
 *    }
 *
 * @apiError CantRejectEvent There was a problem at rejecting events
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1003000,
 *      message: "There was a problem at rejecting events.",
 *      detail: {},
 *      errors: []
 *    }
 *
 *
 * @apiError InvalidAuthorizationRejectEvent There was a problem at rejecting event
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1003001,
 *      message: "Invalid authorization, you can't reject event without invitation.",
 *      detail: {},
 *      errors: []
 *    }
 *
 *
 * @apiError CantRejectEventCancelled There was a problem at rejecting events
 *
 * @apiErrorExample Error-Response
 *    HTTP/1.1 400 Bad Request
 *    {
 *      code: 1003002,
 *      message: "Can't eject invitation to an event that has already been cancelled.",
 *      detail: {},
 *      errors: []
 *    }
 *
 */
function rejectEvent(req, res) {    

  Event.findOne({ _id: req.body.event_id, guestList: {_id: req.current_user._id, accepted: 0}}).exec(function(err, event){
    if (err){
        return res.status(400).send(errors.newError(errors.errorsEnum.CantAcceptEvent, err))
      }
      if (!event) {
        res.status(401).json(errors.newError(errors.errorsEnum.InvalidAuthorizationRejectEvent));
      } else {
        if (!event.active) {
            res.status(401).json(errors.newError(errors.errorsEnum.CantRejectEventCancelled));
        } else {          

          Event.rejectEvent(req.body.event_id, req.current_user._id, function(err, eventUpdated){
          	  if (err) {            
                return res.status(400).json(errors.newError(errors.errorsEnum.CantRejectEvent, err));
            }    
            //First, I get the user who rejected the invitation, second i get the event's user.
            User.getUser(req.current_user._id, function(err, userReject) {
                if (err){
                    return res.status(400).send(errors.newError(errors.errorsEnum.CantSendMail, err))
                }
                if (!userReject) {
                    return res.status(401).json(errors.newError(errors.errorsEnum.CantSendMail));
                }       
                User.getUser(eventUpdated.user, function(err,userEvent){
                    if (err){
                        return res.status(400).send(errors.newError(errors.errorsEnum.CantSendMail, err))
                    }
                    if (!userEvent) {
                        return res.status(401).json(errors.newError(errors.errorsEnum.CantSendMail));
                    }       
                    mailer.rejectInvitationEmail(userReject,userEvent, eventUpdated, function(error){                
                     // TODO: Handle error if exists
                    });
                });
            });

            res.status(201).json({
              message: "Invitation Rejected",
              event: eventUpdated.asJson()
             });
         });  
        }
      }            
  });
}

exports.createEvent = createEvent;
//exports.get = get;
exports.getEvent = getEvent;
exports.updateEvent = updateEvent;
exports.cancelEvent = cancelEvent;
exports.acceptEvent = acceptEvent;
exports.rejectEvent = rejectEvent;
exports.getMyEvents = getMyEvents;
exports.getPendingEvents = getPendingEvents;
exports.getUpcomingEvents = getUpcomingEvents;

