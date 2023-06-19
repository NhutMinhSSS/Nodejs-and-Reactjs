const EnumMessage = require('../common/enums/enum_message');
const SystemConst = require('../common/consts/system_const');
const db = require('../config/connect_database.config');
const logger = require('../config/logger.config');
const sequelize = db.getPool();
const ServerResponse = require('../common/utils/server_response');
const AccountService = require('../services/account_services/account.service');
const StudentService = require('../services/student_services/student.service');
class UserManager {
    async addStudentOrTeacher(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const email = req.body.email;
            const password = req.body.password;
            const role = req.body.role;
            const studentCode = req.body.student_code;
            const firstName = req.body.first_name;
            const lastName = req.body.last_name;
            const dateOfBirth = req.body.date_of_birth;
            const gender = req.body.gender;
            const phoneNumber = req.body.phone_number;
            const CCCD = req.body.CCCD;
            const address = req.body.address;
            if (!email || !password || !role || !studentCode || !firstName || !lastName || !dateOfBirth || !gender || !CCCD || !address) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    "Required information");
            }
            const newAccount = await AccountService.addAccount(email, password, role, transaction);
            if (role == 0) {
                const regularClassId = req.body.regular_class_id;
                await StudentService.addStudent(studentCode, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, newAccount.id, regularClassId, address, transaction);
            } else {
                //addTeacher
            }
            await transaction.commit();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
        } catch (error) {
            await transaction.rollback();
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
}

module.exports = new UserManager;