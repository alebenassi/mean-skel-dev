var _ = require('lodash');

var newError = function(err, detail, keys) {
    if(!keys)
        keys = [];
    if(!detail)
        detail = {};
    
    var errors = detail && !_.isEmpty(detail.errors) ? _.keys(detail.errors) : [];
    errors = _.union(errors, keys); //Create an array of uniq values
    return {
        code: err.code,
        message: err.message,
        detail : detail,
        errors : errors
    };
};

var errorsEnum = {
    //Post user
    CantCreateUser: {code: 1000000, message: "Can't create new user."},
    UserEmailAlreadyUsed: {code: 1000001, message: "A user with that email already exists."},
    
    //Login
    LoginInvalidCredentials: {code: 1000100, message: "Invalid credentials."},
    CantAuthenticateUser: {code: 1000101, message: "There was a problem on authenticate user."},
    AccountNotActive: {code: 1000102, message: "Please activate your account."},
    
    //Put user
    CantEditUser: {code: 1000200, message: "Can't edit user."},
    CantEditPassword: {code: 1000201, message: "Current password is invalid."},
    
    //Activate Account
    CantActivateAccount: {code: 1000300, message: "There was a problem at activate account."},
    InvalidToken: {code: 1000301, message: "Invalid token."},
    
    //Permission
    AuthToken:  {code: 1000400, message: "Can't authenticate token."},
    NoTokenProvided: {code: 1000401, message: "No token provided."},

    //Post Event
    CantCreateEvent: {code: 1000500, message: "Can't create new event."},   

    //Get Users
    CantGetUser: {code: 1000600, message: "Can't get users."}, 

    //Get Events
    CantGetEvent: {code: 1000700, message: "Can't get events"},    
    InvalidAuthorizationGetEvent: {code: 1000701, message: "Invalid authorization, you can't get event."},    
    CantGetEventCancelled: {code: 1000702, message: "Can't get event that has already been cancelled."},    


    //Update Events
    CantUpdateEvent: {code: 1000800, message: "Can't update event."},
    InvalidAuthorizationUpateEvent: {code: 1000801, message: "Invalid authorization, you can't update event"},
    CantUpdateEventCancelled: {code: 1000802, message: "Can't update event cancelled."},

    //Cancel Event
    CantCancelEvent: {code: 1001000, message: "Can't cancel event."},
    InvalidAuthorizationCancelEvent: {code: 1001001, message: "Invalid authorization, you can't cancel event."},
    CantCancelEventCancelled: {code: 1001002, message: "Can't cancel event that has already been cancelled."},

    //Accept Event
    CantAcceptEvent: {code: 1002000, message: "Can't accept event."},
    InvalidAuthorizationAcceptEvent: {code: 1002001, message: "Invalid authorization, you can't accept event without invitation."},
    CantAcceptEventCancelled: {code: 1002002, message: "Can't accept invitation to an event that has already been cancelled."},

    //Reject Event
    CantRejectEvent: {code: 1003000, message: "Can't reject event."},
    InvalidAuthorizationRejectEvent: {code: 1003001, message: "Invalid authorization, you can't reject event without invitation."},
    CantRejectEventCancelled: {code: 1003002, message: "Can't reject invitation to an event that has already been cancelled."},

    //Send Mail
    CantSendMail: {code: 1004000, message: "Can't send mail."},

    //Get My Events
    CantGetMyEvents: {code: 1005000, message: "Can't get my events."},

    //Get Upcoming Events
    CantGetUpcomingEvents: {code: 1006000, message: "Can't get upcoming events."},

    //Get Pending Events
    CantGetPendingEvents: {code: 1007000, message: "Can't get pending events."},

    //Get Pending Events
    CantGetEventUser: {code: 1008000, message: "Can't get event user."},

    //Get Active User
    CantGetActiveUsers: {code: 1009000, message: "Can't get active users."}

};

exports.errorsEnum = errorsEnum;
exports.newError = newError;