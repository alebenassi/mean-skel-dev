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
    console.log(err);
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
function get(req, res) {
  Event
    .find()        
    .exec(function(err, events){
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
function getEvent(req, res) {  
  Event
    .findOne({_id : req.body.event_id})          
    .exec(function(err, event){
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
 */
function updateEvent(req, res) {  
  Event
  .findOneAndUpdate({_id: req.body._id}, {title:req.body.title, description:req.body.description}, function(err, eventUpdated){        
    if (err) {            
        return res.status(400).json(errors.newError(errors.errorsEnum.CantUpdateEvent, err));
    }    
    res.status(201).json({
      message: "Event updated!",
      event: eventUpdated.asJson()
    });
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
 * @apiError CantCancelEvent There was a problem at cancelling events
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
 */
function cancelEvent(req, res) {  
  Event
  .findOneAndUpdate({_id: req.body.event_id}, {active:false}, function(err, eventUpdated){        
    if (err) {            
        return res.status(400).json(errors.newError(errors.errorsEnum.CantCancelEvent, err));
    }    

    eventUpdated.guestList.forEach(function(user){    
      if (user.accepted != 2) {  //If the user cancel, dont send mail
        User
        .findOne({_id : user._id})          
        .exec(function(err, user){
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
 */
function acceptEvent(req, res) {    
  Event
  .findOneAndUpdate({_id: req.body.event_id, "guestList._id": req.body.user_id},  {$inc: {"guestList.$.accepted": 1}}, function(err, eventUpdated){        
    if (err) {            
        return res.status(400).json(errors.newError(errors.errorsEnum.CantAcceptEvent, err));
    }    

    //First, I get the user who accepted the invitation, second i get the event's user.
    User
    .findOne({_id : req.body.user_id})          
    .exec(function(err, userAccept){
        if (err){
            return res.status(400).send(errors.newError(errors.errorsEnum.CantSendMail, err))
        }
        if (!userAccept) {
            return res.status(401).json(errors.newError(errors.errorsEnum.CantSendMail));
        }       
        User
        .findOne({_id : eventUpdated.user})          
        .exec(function(err, userEvent){
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
 */
function rejectEvent(req, res) {    
  Event
  .findOneAndUpdate({_id: req.body.event_id, "guestList._id": req.body.user_id},  {$inc: {"guestList.$.accepted": 2}}, function(err, eventUpdated){        
    if (err) {            
        return res.status(400).json(errors.newError(errors.errorsEnum.CantRejectEvent, err));
    }    

    //First, I get the user who rejected the invitation, second i get the event's user.
    User
    .findOne({_id : req.body.user_id})          
    .exec(function(err, userAccept){
        if (err){
            return res.status(400).send(errors.newError(errors.errorsEnum.CantSendMail, err))
        }
        if (!userAccept) {
            return res.status(401).json(errors.newError(errors.errorsEnum.CantSendMail));
        }       
        User
        .findOne({_id : eventUpdated.user})          
        .exec(function(err, userEvent){
            if (err){
                return res.status(400).send(errors.newError(errors.errorsEnum.CantSendMail, err))
            }
            if (!userEvent) {
                return res.status(401).json(errors.newError(errors.errorsEnum.CantSendMail));
            }       
            mailer.rejectInvitationEmail(userAccept,userEvent, eventUpdated, function(error){                
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

exports.createEvent = createEvent;
exports.get = get;
exports.getEvent = getEvent;
exports.updateEvent = updateEvent;
exports.cancelEvent = cancelEvent;
exports.acceptEvent = acceptEvent;
exports.rejectEvent = rejectEvent;

