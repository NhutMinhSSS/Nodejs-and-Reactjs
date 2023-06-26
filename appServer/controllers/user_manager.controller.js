const EnumMessage = require('../common/enums/enum_message');
const SystemConst = require('../common/consts/system_const');
const db = require('../config/connect_database.config');
const logger = require('../config/logger.config');
const sequelize = db.getPool();
const ServerResponse = require('../common/utils/server_response');
const AccountService = require('../services/account_services/account.service');
const StudentService = require('../services/student_services/student.service');
const TeacherService = require('../services/teacher_services/teacher.service');
const AccountService = require('../services/account_services/account.service');
const RegularClassService = require('../services/regular_class.service');
const DepartmentService = require('../services/department.service');
const EnumServerDefinitions = require('../common/enums/enum_server_definitions');
class UserManager {
    async addStudentOrTeacher(req, res) {
        const role = req.body.role;
        const userCode = req.body.user_code;
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const dateOfBirth = req.body.date_of_birth;
        const gender = req.body.gender;
        const phoneNumber = req.body.phone_number;
        const CCCD = req.body.CCCD;
        const address = req.body.address;
        if (role === null || !userCode || !firstName || !lastName || !dateOfBirth || gender === null || !CCCD || !address) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                "Required information");
        }
        const email = `${userCode}@caothang.edu.vn`;
        const transaction = await sequelize.transaction();
        try {
            const checkAccount = await AccountService.checkEmailExist(email);
            if (checkAccount) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                    EnumMessage.ALREADY_EXIST);
            }
            const newAccount = await AccountService.addAccount(email, CCCD, role, transaction);
            if (role == 0) {
                const regularClassId = req.body.regular_class_id;
                await StudentService.addStudent(userCode, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, newAccount.id, regularClassId, address, transaction);
            } else {
                const departmentId = req.body.department_id;
                await TeacherService.addTeacher(userCode, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, newAccount.id, departmentId, address, transaction);
            }
            await transaction.commit();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
        } catch (error) {
            await transaction.rollback();
            logger.error(error);
            return ServerResponse.createErrorResponse(
                res,
                SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR,
            );
        }
    }
    async updateUser(req, res) {
        const userId = req.body.user_id;
        const role = req.body.role;
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const dateOfBirth = req.body.date_of_birth;
        const gender = req.body.gender;
        const phoneNumber = req.body.phone_number;
        const CCCD = req.body.CCCD;
        const address = req.body.address;
        if (!role === null || !userId || !firstName || !lastName || !dateOfBirth || gender === null || !phoneNumber || !CCCD || !address) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            let isUpdate = false;
            if (role === EnumServerDefinitions.ROLE.STUDENT) {
                const regularClassId = req.body.regular_class_id;
                if (!regularClassId) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST, 
                        EnumMessage.REQUIRED_INFORMATION);
                }
                const regularClass = await RegularClassService.checkRegularClassExist(regularClassId);
                if (!regularClass) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                        EnumMessage.NOT_EXIST);
                }
                const isCheck = await StudentService.checkCCDDExist(CCCD);
                if (isCheck && isCheck.id !== userId) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                        EnumMessage.ALREADY_EXIST);
                }
                isUpdate = await StudentService.updateStudent(userId, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, regularClassId, address);
            } else {
                const departmentId = req.body.department_id;
                if (!departmentId) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST, 
                        EnumMessage.REQUIRED_INFORMATION);
                }
                const department = await DepartmentService.checkDepartmentExist(departmentId);
                if (!department) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                        EnumMessage.NOT_EXIST);
                }
                isUpdate = await TeacherService.updateTeacher(userId, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, departmentId, address);
            }
            if (!isUpdate) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ERROR_UPDATE);
            }
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
        } catch (error) {
            logger.error(error); 
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async deleteUser(req, res) {
        const userId = req.params.user_id;
        const role = req.body.role;
        if (!userId || role === null) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            let isDelete = false;
            if (role === EnumServerDefinitions.ROLE.STUDENT) {
                isDelete = await StudentService.deleteStudent(userId, transaction);
            } else {
                isDelete = await TeacherService.deleteTeacher(userId, transaction);
            }
            if (!isDelete) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ERROR_DELETE);
            }
            await transaction.commit();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
}

module.exports = new UserManager();
