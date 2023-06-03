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
        const transaction = await Account.sequelize.transaction();
        try {
            const hashedPassword = await BcryptUtils.hashPassword(password);
            const newAccount = await Account.create({
                email: email,
                password: hashedPassword,
                role: role
            },
            { transaction });
            await transaction.commit();
            return newAccount;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new AccountService;