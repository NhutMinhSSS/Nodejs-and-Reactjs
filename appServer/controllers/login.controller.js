const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const BcryptUtils = require("../config/bcrypt_utils.config");
const createToken = require("../config/create_token.config");
const logger = require("../config/logger.config");
const ServerResponse = require('../common/utils/server_response');
const AccountService = require("../services/account_services/account.service");

class LoginController {

    async login(req, res) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            if (!email || !password) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.LOGIN.REQUIRED_EMAIL_AND_PASSWORD);
            }
            //bcrypt password
            const account = await AccountService.findAccountByEmail(email);
            if (account != null) {
                const isMatch = await BcryptUtils.comparePassword(password, account.password);
                if (isMatch) {
                    const accessToken = createToken({ account_id: account.id, role: account.role });
                    return res.status(SystemConst.STATUS_CODE.SUCCESS).json({
                        result_message: EnumMessage.RESPONSE.SUCCESS,
                        token: accessToken,
                        role: account.role
                    });
                } else {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.UNAUTHORIZED_REQUEST,
                        EnumMessage.LOGIN.INVALID_PASSWORD);
                }
            } else {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.LOGIN.NO_EXISTS_EMAIL);
            }
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
}

module.exports = new LoginController;