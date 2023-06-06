class EnumMessage{
    //Response
    static RESPONSE = {
        //Success
        SUCCESS: 'Success',
        //Failed
        FAILED: 'Failed',
    };
    //Login
    static LOGIN = {
        REQUIRED_EMAIL_AND_PASSWORD: 'Email and password are required',
        NO_EXISTS_EMAIL: 'No exist email',
        INVALID_PASSWORD: 'Invalid password',
    }
    //Default error
    static DEFAULT_ERROR = 'Error in the server';
    //Error Unauthorized
    static ACCESS_DENIED_ERROR = 'Access denied';
    static UNAUTHORIZED_ERROR = 'Unauthorized';
    //Error token
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
    //Error create classroom
    static REQUIRED_CLASS_NAME = 'Required class name';
    //Teacher no exists
    static TEACHER_NO_EXISTS = 'Teacher no exists';
    //Role invalid
    static ROLE_INVALID = 'Role Invalid';
}
module.exports = EnumMessage;