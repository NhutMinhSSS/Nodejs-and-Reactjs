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
    static ROLE = {
        STUDENT: 0,
        TEACHER: 1
    };
    static EMPTY = 0;
}
module.exports = EnumServerDefinitions;