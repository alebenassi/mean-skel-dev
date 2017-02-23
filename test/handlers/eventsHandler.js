var request = require('supertest'),
    factory = require('factory-girl'),
    Event = require('../../app/models/event'),
    nock = require('nock'),
    expect = require('chai').expect,
	async = require('async'),
	sinon = require('sinon');

describe('EventsHandler', function () {
	
	describe('POST /api/events', function () {
        var validEvent = null;        
        var server;
        var access_token;
        var validUser = null;
        var password = "testpassword";
        
        before(function(done){
            server = require('../../server');
            
            // Create valid event
            factory.create("event", function (error, event) {
                if (!error)
                    validEvent = event;
                else
                    throw error;
                
                done();
            });

            // Create valid user
            factory.create("user", {password: password, active: true}, function (error, user) {
                if (!error)
                    validUser = user;
                else
                    throw error;

                // Authenticate user
                request(server)
                    .post('/api/users/authenticate')
                    .send({ email: validUser.email, password: password })
                    .end(function(err, res){
                        access_token = res.body.token;
                        done();
                    });
            });
        });
        	   
        it('responds with status 403 if token is not present', function (done) {
            request(server)
                .put('/api/user')
                .expect('Content-Type', /json/)
                .expect(function(response){
                    expect(response.body.code).to.equal(1000401);
                    expect(response.body.message).to.exist;
                    expect(response.body.detail).to.exist;
                    expect(response.body.errors).to.be.empty;
                })
                .expect(403, done);
        });

        it('responds with status 403 if token is invalid', function (done) {
            request(server)
                .put('/api/user')
                .set('x-access-token', 'invalidtoken')
                .expect('Content-Type', /json/)
                .expect(function(response){
                    expect(response.body.code).to.equal(1000400);
                    expect(response.body.message).to.exist;
                    expect(response.body.detail).to.exist;
                    expect(response.body.errors).to.be.empty;
                })
                .expect(403, done);
        });
    
        it('responds with status 403 if token is valid and cant get current user', function (done) {
            var mockFindOne = {
                findOne: function(){
                    return this;
                },
                select: function(){
                    return this;
                },
                exec: function(callback){
                    callback(new Error('Oops'));
                }
            };
            var stub = sinon.stub(User, 'findOne').returns(mockFindOne);
            request(server)
                .put('/api/user')
                .set('x-access-token', access_token)
                .expect('Content-Type', /json/)
                .expect(function(response){
                    stub.restore();
                    expect(response.body.code).to.equal(1000400);
                    expect(response.body.message).to.exist;
                    expect(response.body.detail).to.exist;
                    expect(response.body.errors).to.be.empty;
                })
                .expect(403, done);
        });

	    it('responds with error if some validation fails', function (done) {
	    	request(server)
	    		.post('/api/events')
  				.send({ title: "test", description: 'test', date: '', guestList: null })
  				.expect('Content-Type', /json/)
                .expect(function(response){
                    expect(response.body.code).to.equal(1000500);
                    expect(response.body.message).to.exist;
                    expect(response.body.detail).to.exist;
                    expect(response.body.errors).to.contains('date')
                })
                .expect(400, done);
	    });

	    it('responds with success if the event was created', function (done) {
	    	var event = factory.build("event", function(error, event){
	    		request(server)
		    		.post('/api/events')
	  				.send({ title: event.title, description: event.description, date: event.date, guestList: event.guestList })
	  				.expect('Content-Type', /json/)
                    .expect(function(response){
                        expect(response.body.message).to.exist;
                        expect(response.body.event).to.exist;
                        expect(response.body.event._id).to.exist;
                        expect(response.body.event.title).to.equal(event.title);
                    })
                    .expect(201, done);
	    	});
	    });

    });
	

    describe('POST /api/events/updateEvent', function () {
    	var validEvent = null;        
        var server;
        var access_token;
        var validUser = null;
        var password = "testpassword";
        
        before(function(done){
            server = require('../../server');
            
            // Create valid event
            factory.create("event", function (error, event) {
                if (!error)
                    validEvent = event;
                else
                    throw error;
                
                done();
            });

            // Create valid user
            factory.create("user", {password: password, active: true}, function (error, user) {
                if (!error)
                    validUser = user;
                else
                    throw error;

                // Authenticate user
                request(server)
                    .post('/api/users/authenticate')
                    .send({ email: validUser.email, password: password })
                    .end(function(err, res){
                        access_token = res.body.token;
                        done();
                    });
            });
        });
               
        it('responds with status 403 if token is not present', function (done) {
            request(server)
                .put('/api/user')
                .expect('Content-Type', /json/)
                .expect(function(response){
                    expect(response.body.code).to.equal(1000401);
                    expect(response.body.message).to.exist;
                    expect(response.body.detail).to.exist;
                    expect(response.body.errors).to.be.empty;
                })
                .expect(403, done);
        });

        it('responds with status 403 if token is invalid', function (done) {
            request(server)
                .put('/api/user')
                .set('x-access-token', 'invalidtoken')
                .expect('Content-Type', /json/)
                .expect(function(response){
                    expect(response.body.code).to.equal(1000400);
                    expect(response.body.message).to.exist;
                    expect(response.body.detail).to.exist;
                    expect(response.body.errors).to.be.empty;
                })
                .expect(403, done);
        });
    
        it('responds with status 403 if token is valid and cant get current user', function (done) {
            var mockFindOne = {
                findOne: function(){
                    return this;
                },
                select: function(){
                    return this;
                },
                exec: function(callback){
                    callback(new Error('Oops'));
                }
            };
            var stub = sinon.stub(User, 'findOne').returns(mockFindOne);
            request(server)
                .put('/api/user')
                .set('x-access-token', access_token)
                .expect('Content-Type', /json/)
                .expect(function(response){
                    stub.restore();
                    expect(response.body.code).to.equal(1000400);
                    expect(response.body.message).to.exist;
                    expect(response.body.detail).to.exist;
                    expect(response.body.errors).to.be.empty;
                })
                .expect(403, done);
        });
	    

	    it('responds with error if some validation fails', function (done) {
	    	request(server)
	    		.post('/api/events/updateEvent')
	    		.set('x-access-token', access_token)
	    		.send({ title: "  ", description: "  " }) // Invalid update
	    		.expect('Content-Type', /json/)
                .expect(function(response){
                    expect(response.body.code).to.equal(1000800);
                    expect(response.body.message).to.exist;
                    expect(response.body.detail).to.exist;
                    expect(response.body.errors).to.contains('title');
                    expect(response.body.errors).to.contains('description');
                })
                .expect(400, done);
	    });
	    

	    it('responds with success and event info if the event was updated', function (done) {
	    	request(server)
	    		.post('/api/events/updateEvent')
	    		.set('x-access-token', access_token)
	    		.send({ title: "Test", description: "Test" })
	    		.expect('Content-Type', /json/)
	    		.expect(function(response){
  					expect(response.body.errors).to.not.exist;
  					expect(response.body.event).to.exist;  					
  					expect(response.body.event.title).to.equal("Test");
  					expect(response.body.event.title).to.equal("Test");
  					expect(response.body.event._id).to.equal(String(validEvent._id));
  				})
  				.expect(200, done);
	    });
			
    });

    describe('POST /api/events/cancelEvent', function () {
        var validEvent = null;        
        var server;
        var access_token;
        var validUser = null;
        var password = "testpassword";
        
        before(function(done){
            server = require('../../server');
            
            // Create valid event
            factory.create("event", function (error, event) {
                if (!error)
                    validEvent = event;
                else
                    throw error;
                
                done();
            });

            // Create valid user
            factory.create("user", {password: password, active: true}, function (error, user) {
                if (!error)
                    validUser = user;
                else
                    throw error;

                // Authenticate user
                request(server)
                    .post('/api/users/authenticate')
                    .send({ email: validUser.email, password: password })
                    .end(function(err, res){
                        access_token = res.body.token;
                        done();
                    });
            });
        });
               
        it('responds with status 403 if token is not present', function (done) {
            request(server)
                .put('/api/user')
                .expect('Content-Type', /json/)
                .expect(function(response){
                    expect(response.body.code).to.equal(1000401);
                    expect(response.body.message).to.exist;
                    expect(response.body.detail).to.exist;
                    expect(response.body.errors).to.be.empty;
                })
                .expect(403, done);
        });

        it('responds with status 403 if token is invalid', function (done) {
            request(server)
                .put('/api/user')
                .set('x-access-token', 'invalidtoken')
                .expect('Content-Type', /json/)
                .expect(function(response){
                    expect(response.body.code).to.equal(1000400);
                    expect(response.body.message).to.exist;
                    expect(response.body.detail).to.exist;
                    expect(response.body.errors).to.be.empty;
                })
                .expect(403, done);
        });
    
        it('responds with status 403 if token is valid and cant get current user', function (done) {
            var mockFindOne = {
                findOne: function(){
                    return this;
                },
                select: function(){
                    return this;
                },
                exec: function(callback){
                    callback(new Error('Oops'));
                }
            };
            var stub = sinon.stub(User, 'findOne').returns(mockFindOne);
            request(server)
                .put('/api/user')
                .set('x-access-token', access_token)
                .expect('Content-Type', /json/)
                .expect(function(response){
                    stub.restore();
                    expect(response.body.code).to.equal(1000400);
                    expect(response.body.message).to.exist;
                    expect(response.body.detail).to.exist;
                    expect(response.body.errors).to.be.empty;
                })
                .expect(403, done);
        });
        

        it('responds with error if the id of event is null', function (done) {
            request(server)
                .post('/api/events/cancelEvent')
                .set('x-access-token', access_token)
                .send({ _id : null })
                .expect('Content-Type', /json/)
                .expect(function(response){
                    expect(response.body.code).to.equal(1001000);
                    expect(response.body.message).to.exist;
                    expect(response.body.detail).to.exist;
                    expect(response.body.errors).to.contains('_id');                
                })
                .expect(400, done);
        });
        

        it('responds with success if the event was updated', function (done) {
            request(server)
                .post('/api/events/cancelEvent')
                .set('x-access-token', access_token)
                .send({ _id: validEvent._id })
                .expect('Content-Type', /json/)
                .expect(function(response){
                    expect(response.body.errors).to.not.exist;
                    expect(response.body.event).to.exist;                                       
                    expect(response.body.event._id).to.equal(String(validEvent._id));
                })
                .expect(200, done);
        });
            
    });

});
