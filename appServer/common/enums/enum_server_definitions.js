class EnumServerDefinitions {
    static OK = 'OK';
    static ERROR = 'error';
    static FINISH = 'finish';
    static AUTHORIZATION = 'authorization';
    //
    static STATUS = {
        ACTIVE: 1,
        NO_ACTIVE: 0,
        CLOSE: 2,
        STORAGE: 3,
    };
    //
    static ROLE = {
        STUDENT: 0,
        TEACHER: 1,
        ADMIN: 2
    };
    //
    static EMPTY = 0;
    //
    static POST_CATEGORY = {
        NEWS: 1,
        DOCUMENT: 2,
        EXERCISE: 3,
        EXAM: 4,
    }
    static SUBMISSION = {
        UNSENT: 0,
        NOT_SCORED: 1,
        SUBMITTED: 2,
    }
}
module.exports = EnumServerDefinitions;