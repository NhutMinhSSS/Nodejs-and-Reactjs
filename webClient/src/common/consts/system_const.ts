class SystemConst {
    static DOMAIN = 'http://20.39.197.125:3000/api';
    static STATUS_CODE = {
        SUCCESS: 200,
        BAD_REQUEST: 400,
        FORBIDDEN_REQUEST: 403,
        UNAUTHORIZED_REQUEST: 401,
        // not found
        NOT_FOUND: 404,
        CONFLICT: 409,
        INTERNAL_SERVER: 500,
    };


}
export default SystemConst;
