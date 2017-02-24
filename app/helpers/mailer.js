var config = require('../../config').config();
var sendgrid = require('sendgrid')(config.sendgrid.API_KEY);


function sendActivationEmail(user, done) {	


	try {
		var link = config.base_url + "/activate/" + user.activation_token;

		var email     = new sendgrid.Email({
			to:       user.email,
			from:     'no-reply@meanskel.com',
			fromname: 'MEAN skel',
			subject:  'Please activate your account!',
			html:     "<p>Welcome! " + user.email + "</p><p>Please follow this link to activate your account</p><p><a href='" + link + "'>" + link + "</a></p>"
		});

		sendgrid.send(email, function(err, json) {
			if (err)
				done(err);
			else
				done(null);
		});
	}
	catch(err) {
	    done(err);
	}
}

function sendInvitationEmail(user, event, done) {		


	try {
		var link = config.base_url + "/pending";

		var email     = new sendgrid.Email({
			to:       user.email,
			from:     'no-reply@meanskel.com',
			fromname: 'MEAN skel',
			subject:  'Event Invitation',
			html:     "<p>Hi " + user.firstname + "</p><p>You have been  invited to the event " + event.title + ". Please follow the link to view pending events.</p><p><a href='" + link + "'>" + link + "</a></p>"
		});

		sendgrid.send(email, function(err, json) {
			if (err)
				done(err);
			else
				done(null);
		});
		
	}
	catch(err) {
	    done(err);
	}
}

function rejectInvitationEmail(userReject,userEvent, event, done) {	
	

	try {		
		
		var email     = new sendgrid.Email({
			to:       userEvent.email,
			from:     'no-reply@meanskel.com',
			fromname: 'MEAN skel',
			subject:  'Reject Invitation',
			html:     "<p>Hi " + userEvent.firstname + "</p><p>The user " + userReject.firstname + " " + userReject.lastname + " (" + userReject.email + ")" + " rejects the invitation of your event " + event.title + "</p>"
		});

		sendgrid.send(email, function(err, json) {
			if (err)
				done(err);
			else
				done(null);
		});
		
	}
	catch(err) {
	    done(err);
	}
}

function acceptInvitationEmail(userAccept, userEvent, event, done) {			

	try {		
		
		var email     = new sendgrid.Email({
			to:       userEvent.email,
			from:     'no-reply@meanskel.com',
			fromname: 'MEAN skel',
			subject:  'Accept Invitation',
			html:     "<p>Hi " + userEvent.firstname + "</p><p>The user " + userAccept.firstname + " " + userAccept.lastname + " (" + userAccept.email + ")" + " accepts the invitation of your event " + event.title + "</p>"
		});

		sendgrid.send(email, function(err, json) {
			if (err)
				done(err);
			else
				done(null);
		});
		
		
	}
	catch(err) {
	    done(err);
	}
}

function cancelEventEmail(user, event, done) {	

	
	
	try {		

		var email     = new sendgrid.Email({
			to:       user.email,
			from:     'no-reply@meanskel.com',
			fromname: 'MEAN skel',
			subject:  'Event canceled',
			html:     "<p>Hi " + user.firstname + "</p><p>The event " + event.title + " has been cancelled. Please contact the administrator.</p>"
		});

		sendgrid.send(email, function(err, json) {
			if (err)
				done(err);
			else
				done(null);
		});
		
	}
	catch(err) {
	    done(err);
	}
}

exports.sendActivationEmail = sendActivationEmail;
exports.sendInvitationEmail = sendInvitationEmail;
exports.rejectInvitationEmail = rejectInvitationEmail;
exports.acceptInvitationEmail = acceptInvitationEmail;
exports.cancelEventEmail = cancelEventEmail;

