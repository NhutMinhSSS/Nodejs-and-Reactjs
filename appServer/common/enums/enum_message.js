class EnumMessage{
    static RESPONSE = {
        //Success
        SUCCESS: 'Success',
        //Failed
        FAILED: 'Failed',
    };
    //Login
    static LOGIN = {
        REQUIRED_EMAIL_AND_PASSWORD: 'Email and password are required',
        INVALID_PASSWORD: 'Invalid password',
    }
    //Default error
    static DEFAULT_ERROR = 'Error in the server';
    //Error Unauthorized
    static ACCESS_DENIED_ERROR = 'Access denied';
    static UNAUTHORIZED_ERROR = 'Unauthorized';
    static TOKEN = {
        TOKEN_NOT_PROVIDE: 'Token is not provided',
        TOKEN_NOT_INVALID: 'Token is invalid',
        TOKEN_EXPIRED: 'Token is expired'
    };
    //Error unable connect database
    static UNABLE_CONNECT_DATABASE = 'Unable to connect database';
    //Error hash and compare password
    static ERROR_HASHING_PASSWORD = 'Error hashing password';
    static ERROR_COMPARING_PASSWORDS = 'Error comparing passwords';
    //
}
module.exports = EnumMessage;