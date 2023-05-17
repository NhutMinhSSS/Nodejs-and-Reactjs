class SystemConst {
    static PORT = 3000;
    static DOMAIN = '192.168.1.9'
    static STATUS_CODE = {
        SUCCESS: 200,
        BAD_REQUEST: 400,
        FORBIDDEN_REQUEST: 403,
        UNAUTHORIZED_REQUEST: 401,
        // not found
        NOT_FOUND: 404,
        INTERNAL_SERVER: 500
    };
    // time token
    static EXPIRES_IN = '1d';
}
module.exports = SystemConst;