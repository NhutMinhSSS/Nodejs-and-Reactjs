const EnumMessage = require("../common/enums/enum_message");
const { STATUS } = require("../common/enums/enum_server_definitions");
const BcryptUtils = require("../config/bcrypt_utils.config");
const logger = require("../config/logger.config");
const Account = require("../models/account.model");

class AccountService {
    async findAccountByEmail(email) {
        try {
            const account = await Account.findOne({
                where: {
                    email: email,
                    status: STATUS
                }
            });
            return account;
        } catch (error) {
            throw error;
        }
    }
    async addAccount(email, password, role) {
        try {
            const hashedPassword = await BcryptUtils.hashPassword(password);
            const newAccount = await Account.create({
                email: email,
                password: hashedPassword,
                role: role
            });
            return newAccount;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AccountService;