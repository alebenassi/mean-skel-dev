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


/*EventSchema.pre("save", function(next) {
    this.wasNew = this.isNew;
    next();
});

// Send welcome email with activation link
EventSchema.post("save", function(event) {
  if (event.wasNew) {    
      mailer.sendInvitationEmail(event, function(error){
      // TODO: Handle error if exists
      });
  }
});
*/



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


module.exports = mongoose.model("Event", EventSchema);
