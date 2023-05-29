class EnumMessage{
    static RESPONSE = {
        //Success
        SUCCESS: 'Success',
        //Failed
        FAILED: 'Failed',
    };
    
    //Error
    static ACCESS_DENIED_ERROR = 'Access denied';
    static UNAUTHORIZED_ERROR = 'Unauthorized';
    static TOKEN = {
        TOKEN_NOT_PROVIDE: 'Token is not provided',
        TOKEN_NOT_INVALID: 'Token is invalid',
        TOKEN_EXPIRED: 'Token is expired'
    };
   
    static UNABLE_CONNECT_DATABASE = 'Unable to connect database';
    static DEFAULT_ERROR = 'Error in the server';
}
module.exports = EnumMessage;