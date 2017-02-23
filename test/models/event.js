var expect = require('chai').expect,
    Event = require('../../app/models/event'),
    s3Manager = require("../../app/helpers/s3Manager"),
    sinon = require('sinon'),
    bcrypt = require("bcrypt-nodejs"),
    factory = require('factory-girl');

 describe('Event', function () {

  describe('Valid Event', function () {
    var validEvent = null;    

    // Create a event and store it in validEvent object
    before(function(done){
      // Create valid event
      factory.create("event", function (error, event) {
          if (!error)
            validEvent = event;
          else
            throw error;

          done();
      });
    });    

    it('is not active by default', function (done) {
      expect(validEvent.active).to.equal(false);
      done();
    });
    

  });

  describe('Invalid Event', function () {

    it('is invalid without title', function (done) {
      factory.create("title", {title: null}, function (error, event) {
        expect(error).to.exist;
        var title_error = error.errors.title;
        expect(title_error.message).to.equal("Title is required.");
        done();
      });
    });

    it('is invalid without description', function (done) {
      factory.create("description", {description: null}, function (error, event) {
        expect(error).to.exist;
        var description_error = error.errors.description;
        expect(description_error.message).to.equal("Description is required.");
        done();
      });
    });

    it('is invalid without date', function (done) {
      factory.create("date", {date: null}, function (error, event) {
        expect(error).to.exist;
        var date_error = error.errors.date;
        expect(date_error.message).to.equal("Date is required.");
        done();
      });
    });

    it('is invalid without guesList', function (done) {
      factory.create("guesList", {guesList: null}, function (error, event) {
        expect(error).to.exist;
        var guesList_error = error.errors.guesList;
        expect(guestList_error.message).to.equal("Guest List is required.");
        done();
      });
    });

    it('is invalid without user', function (done) {
      factory.create("user", {user: null}, function (error, event) {
        expect(error).to.exist;
        var user_error = error.errors.user;
        expect(user_error.message).to.equal("User is required.");
        done();
      });
    });
    
  });

});

