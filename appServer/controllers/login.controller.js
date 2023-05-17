const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const createToken = require("../config/create_token");
const logger = require("../config/logger");
const Account = require('../models/account.model');

class LoginController {

    async login(req, res) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            if (!email || !password) {
                return res.status(SystemConst.STATUS_CODE.BAD_REQUEST).json({
                    result_message: "Email and password are required"
                });
            }
            //bcrypt password
            const result = await Account.findOne({
                where: {
                    email: email,
                    password: password
                }
            });
            if (result != null) {
                const token = createToken({ accountId: result.id, role: result.role });
                return res.status(SystemConst.STATUS_CODE.SUCCESS).json({
                    result_message: EnumMessage.RESPONSE.SUCCESS,
                    token: token,
                    role: result.role
                });
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