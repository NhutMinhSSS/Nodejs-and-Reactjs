class EnumServerDefinitions {
    static OK = 'OK';
    static ERROR = 'error';
    static FINISH = 'finish';
    static AUTHORIZATION = 'Authorization';
    //
    static STATUS = {
        ACTIVE: 1,
        NO_ACTIVE: 0
    };
    //
    static ROLE = {
        STUDENT: 0,
        TEACHER: 1
    };
    //
    static EMPTY = 0;
    //
    static POST_CATEGORY = {
        NEWS: 1,
        EXAM: 3
    }
    static SUBMISSION = {
        UNSENT: 0,
        NOT_SCORED: 1,
        SUBMITTED: 2,
    }
}
module.exports = EnumServerDefinitions;