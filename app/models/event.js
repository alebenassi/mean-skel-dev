var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  bcrypt = require("bcrypt-nodejs"),
  shortid = require('shortid'),
  mailer = require("../helpers/mailer"),
  config = require("../../config").config(),
  s3Manager = require("../helpers/s3Manager"),
  fs = require("fs");

// event schema
var EventSchema = new Schema({
  title: { type: String, trim: true, required: "Title is required."},
  description: { type: String, trim: true, required: "description is required."},
  date: { type: Date, default: Date.now, required: "date is required."},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  guestList: [
      { user: {type: Schema.Types.ObjectId, ref: 'User'},
        accepted: { type: Number, default: 0 } //0: pending; 1: accepted; 2: reject
      }
  ],
  active: { type: Boolean, default: true}
});




EventSchema.plugin(require("./plugins/foregroundIndexesPlugin"));

EventSchema.methods.asJson = function() {
  var event = this;
  return {
    _id: event._id,
    title: event.title,
    description: event.description,
    date: event.date,
    user: event.user,
    guestList: event.guestList
  };
};


EventSchema.statics.get = function(callback) {  
  this.find().exec(function(err, events){  
      callback(err, events);
    
    });
};

EventSchema.statics.getMyEvents = function(currentUser, callback) {  
  this.find({user: currentUser._id, date: {$gte: new Date()}}).exec(function(err, events){  
      callback(err, events);    
    });
};

EventSchema.statics.getPendingEvents = function(currentUser, callback) {  
  this.find({active: true, date: {$gte: new Date()},guestList: {'_id': currentUser._id, 'accepted': 0}}).exec(function(err, events){  
      callback(err, events);    
    });
};

EventSchema.statics.getUpcomingEvents = function(currentUser, callback) {  
  this.find({ active: true, date: {"$gte": new Date()},"$or": [{guestList: {'_id': currentUser._id, 'accepted': 1}}, {user:currentUser._id}]}).exec(function(err, events){  
      callback(err, events);    
    });
};

EventSchema.statics.getEvent = function(event_id, callback) {
  this.findOne({_id : event_id}).exec(function(err, event){
      callback(err, event);
  });
};

EventSchema.statics.updateEvent = function(event_id,title,description, callback) {
  this.findOneAndUpdate({_id: event_id}, {title:title, description:description}, function(err, eventUpdated){
      callback(err,eventUpdated);
  });
};

EventSchema.statics.cancelEvent = function(event_id, callback) {
  this.findOneAndUpdate({_id: event_id}, {active:false}, function(err, eventUpdated){ 
      callback(err,eventUpdated);
  });
};

EventSchema.statics.acceptEvent = function(event_id, user_id, callback) {
  this.findOneAndUpdate({_id: event_id, "guestList._id": user_id},  {$inc: {"guestList.$.accepted": 1}}, function(err, eventUpdated){  
      callback(err,eventUpdated);
  });
};

EventSchema.statics.rejectEvent = function(event_id, user_id, callback) {
  this.findOneAndUpdate({_id: event_id, "guestList._id": user_id},  {$inc: {"guestList.$.accepted": 2}}, function(err, eventUpdated){  
      callback(err,eventUpdated);
  });
};

module.exports = mongoose.model("Event", EventSchema);
