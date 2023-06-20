const jwt = require('jsonwebtoken');
const logger = require('../config/logger.config');
const EnumServerDefinitions = require('../common/enums/enum_server_definitions');
const EnumMessage = require('../common/enums/enum_message');
const SystemConst = require('../common/consts/system_const');
const ServerResponse = require('../common/utils/server_response');
const AccountService = require('../services/account_services/account.service');

const secretToken = process.env.ACCESS_TOKEN_SECRET;
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers[EnumServerDefinitions.AUTHORIZATION];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            throw new Error(EnumMessage.TOKEN.TOKEN_NOT_PROVIDE); // Ném một lỗi nếu token không được cung cấp
        }
        let decodedUser;
        jwt.verify(token, secretToken, (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    throw new Error(EnumMessage.TOKEN.TOKEN_EXPIRED);
                } else {
                    throw new Error(EnumMessage.TOKEN.TOKEN_NOT_INVALID); // Ném lỗi nếu token không hợp lệ
                }
            }
            decodedUser = user;
        });
        const account = await AccountService.findAccountById(decodedUser.account_id);
        if (!account) {
            const message = decodedUser.role === EnumServerDefinitions.ROLE.TEACHER ? EnumMessage.TEACHER_NOT_EXISTS : EnumMessage.STUDENT_NOT_EXISTS;
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND, message);
        }
        req.user = decodedUser;
        next();
    } catch (error) {
        logger.error(error);
        return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.UNAUTHORIZED_REQUEST,
            error.message);
    }
}

module.exports = authenticateToken;