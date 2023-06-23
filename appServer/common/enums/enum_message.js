class EnumMessage{
    //Not allow by cors
    static NOT_ALLOW_BY_CORS = 'Not allowed by CORS';
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
    //Error classroom
    static ERROR_CLASSROOM = {
        REQUIRED_INFORMATION: 'Request more information ',
        CLASSROOM_NOT_EXISTS: 'Classroom no exist',
        REQUIRED_CLASS_CODE: 'Request class code'
    };
    //Error post
    static REQUIRED_POST_TITLE = 'Required content';
    //Teacher no exists
    static TEACHER_NOT_EXISTS = 'Teacher no exists';
    //Student no exists
    static STUDENT_NOT_EXISTS = 'Student no exists';
    //Role invalid
    static ROLE_INVALID = 'Role Invalid';
    //You have already joined this class
    static IS_JOINED_CLASSROOM = 'You have already joined classroom';
    //No permission 
    static NO_PERMISSION = 'No permission';
    //Is not belong department
    static TEACHER_NOT_REGULAR_CLASS = `Teacher not assigned to class`;
    static TEACHER_NOT_SUBJECT = `Teacher not assigned to subject`;
    //File not exists
    static FILE_NOT_EXISTS = 'File not exists';
    //Error post
    static ERROR_POST = {
        //Post Not exists
        POST_NOT_EXISTS: 'Post not exists',
        POST_NOT_CLASSROOM: 'Post not classroom'
    }
    //Error submission by student
    static ERROR_SUBMISSION = {
        NOT_SUBMISSION: 'Not submission',
        DEADLINE_EXCEEDED: 'Deadline exceeded',
        BEFORE_START_TIME: 'Before start time'
    }
}
module.exports = EnumMessage;