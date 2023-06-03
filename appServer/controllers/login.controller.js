const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const BcryptUtils = require("../config/bcrypt_utils.config");
const createToken = require("../config/create_token.config");
const logger = require("../config/logger.config");
const Account = require('../models/account.model');
const AccountService = require("../services/account.service");

class LoginController {

    async login(req, res) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            if (!email || !password) {
                return res.status(SystemConst.STATUS_CODE.BAD_REQUEST).json({
                    result_message: EnumMessage.LOGIN.REQUIRED_EMAIL_AND_PASSWORD
                });
            }
            //bcrypt password
            const account = await AccountService.findAccountByEmail(email);
            if (account != null) {
                const isMatch = BcryptUtils.comparePassword(password, account.password);
                if (isMatch) {
                    const accessToken = createToken({ accountId: account.id, role: account.role });
                    return res.status(SystemConst.STATUS_CODE.SUCCESS).json({
                        result_message: EnumMessage.RESPONSE.SUCCESS,
                        token: accessToken,
                        role: account.role
                    });
                } else {
                    return res.status(SystemConst.STATUS_CODE.UNAUTHORIZED_REQUEST).json({
                        result_message: EnumMessage.LOGIN.INVALID_PASSWORD
                    });
                }
            } else {
                return res.status(SystemConst.STATUS_CODE.NOT_FOUND).json({
                    result_message: EnumMessage.RESPONSE.FAILED
                });
            }
        } catch (error) {
            logger.error(error);
            res.status(SystemConst.STATUS_CODE.INTERNAL_SERVER).json({
                result_message: EnumMessage.DEFAULT_ERROR
            });
        }
    }
}

module.exports = new LoginController;