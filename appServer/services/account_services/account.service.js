const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const BcryptUtils = require("../../config/bcrypt_utils.config");
const Account = require("../../models/account.model");
const Student = require("../../models/student.model");
const Teacher = require("../../models/teacher.model");

class AccountService {
    async findAccountById(id, role) {
        try {
            const account = await Account.findOne({
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                ...role !== EnumServerDefinitions.ROLE.ADMIN && {
                    include: [{
                        model: role === EnumServerDefinitions.ROLE.TEACHER ? Teacher : Student,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: []
                    }]
                },
                attributes: ['id']
            });
            return account;
        } catch (error) {
            throw error;
        }
    }
    async findAccountByEmail(email) {
        try {
            const account = await Account.findOne({
                where: {
                    email: email,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: [{
                    model: Teacher,
                    required: false,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['first_name', 'last_name']
                }, {
                    model: Student,
                    required: false,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['first_name', 'last_name']
                }]
            });
            return account;
        } catch (error) {
            throw error;
        }
    }
    async checkEmailExist(email) {
        try {
            const isCheck = await Account.findOne({
                where: {
                    email: email
                }
            });
            return !!isCheck;
        } catch (error) {
            throw error;
        }
    }
    async addAccount(email, password, role, transaction) {
        try {
            const hashedPassword = await BcryptUtils.hashPassword(password);
            const newAccount = await Account.create({
                email: email,
                password: hashedPassword,
                role: role
            }, { transaction: transaction });
            return newAccount;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AccountService;