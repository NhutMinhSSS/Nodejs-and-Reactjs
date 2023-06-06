const EnumMessage = require('../common/enums/enum_message');
const SystemConst = require('../common/consts/system_const');
const db = require('../config/connect_database.config');
const logger = require('../config/logger.config');
const sequelize = db.getPool();
const AccountService = require('../services/account.service');
const StudentService = require('../services/student.service');
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
                return res.status(SystemConst.STATUS_CODE.BAD_REQUEST).json({ 
                    result_message: EnumMessage.RESPONSE.FAILED,
                    error_message: "Required information" });
            }
            const newAccount = await AccountService.addAccount(email, password, role, transaction);
            if (role == 0) {
                await StudentService.addStudent(studentCode, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, newAccount.id, address, transaction);
            } else if (role == 1) {
                //addTeacher
            } else {
                return res.status(SystemConst.STATUS_CODE.BAD_REQUEST).json({ 
                    result_message: EnumMessage.RESPONSE.FAILED,
                    error_message:  EnumMessage.ROLE_INVALID});
            }
            await transaction.commit();
            return res.json({ result_message: EnumMessage.RESPONSE.SUCCESS });
        } catch (error) {
            await transaction.rollback();
            logger.error(error);
            return res.status(SystemConst.STATUS_CODE.INTERNAL_SERVER).json({ 
                result_message: EnumMessage.RESPONSE.FAILED,
                error_message: EnumMessage.DEFAULT_ERROR });
        }
    }
}