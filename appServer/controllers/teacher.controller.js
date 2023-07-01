const logger = require('../config/logger.config');
const ServerResponse = require('../common/utils/server_response');
const SystemConst = require('../common/consts/system_const');
const EnumMessage = require('../common/enums/enum_message');
const TeacherService = require('../services/teacher_services/teacher.service');
const AccountService = require('../services/account_services/account.service');
const EnumServerDefinitions = require('../common/enums/enum_server_definitions');
const DepartmentService = require('../services/department.service');
const CommonService = require('../common/utils/common_service');
const db = require('../config/connect_database.config');
const ClassroomService = require('../services/classroom_services/classroom.service');
const ClassroomTeacherService = require('../services/classroom_services/classroom_teacher.service');
const sequelize = db.getPool();

class TeacherController {
    async getAllTeacherInit(req, res) {
        try {
            const teachers = await TeacherService.findAllTeachersAndDepartment();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, teachers);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async getTeachersListNotInClassroom(req, res) {
        const classroomId = req.params.classroom_id;
        if (!classroomId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            const classroom = await ClassroomService.checkClassroomExist(classroomId);
            if (!classroom) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.ERROR_CLASSROOM.CLASSROOM_NOT_EXISTS);
            }
           const teacherList = await TeacherService.findTeachersNotInClassroom(classroomId);
           const result = teacherList.map(({ id, first_name, last_name, Department }) => ({
            id,
            first_name,
            last_name,
            department_name: Department.department_name,
          }))
           return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, result);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async addTeacher(req, res) {
        const teacherCode = req.body.teacher_code;
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const dateOfBirth = req.body.date_of_birth;
        const gender = req.body.gender;
        const phoneNumber = req.body.phone_number;
        const departmentId = req.body.department_id;
        const CCCD = req.body.CCCD;
        const address = req.body.address;
        if (!teacherCode || !firstName || !lastName || !dateOfBirth || gender === null || !departmentId || !CCCD || !address) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                "Required information");
        }
        const role = EnumServerDefinitions.ROLE.TEACHER;
        const email = `${teacherCode}@caothang.edu.vn`;
        const transaction = await sequelize.transaction();
        try {
            const checkAccount = await AccountService.checkEmailExist(email);
            if (checkAccount) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                    EnumMessage.ALREADY_EXIST);
            }
            const isCheckCCCD = await CommonService.checkCCCDUserExist(CCCD, role);
            if (isCheckCCCD) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                    EnumMessage.CCCD_ALREADY_EXIST);
            }
            const department = await DepartmentService.checkDepartmentExist(departmentId);
            if (!department) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.NOT_EXIST);
            }
            const newAccount = await AccountService.addAccount(email, CCCD, role, transaction);
            await TeacherService.addTeacher(teacherCode, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, newAccount.id, departmentId, address, transaction);
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
    async updateTeacher(req, res) {
        const teacherId = req.body.teacher_id;
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const dateOfBirth = req.body.date_of_birth;
        const gender = req.body.gender;
        const phoneNumber = req.body.phone_number;
        const departmentId = req.body.department_id;
        const CCCD = req.body.CCCD;
        const address = req.body.address;
        if (!teacherId || !firstName || !lastName || !dateOfBirth || gender === null || !phoneNumber || !departmentId || !CCCD || !address) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const role = EnumServerDefinitions.ROLE.TEACHER;
        try {
            const department = await DepartmentService.checkDepartmentExist(departmentId);
            if (!department) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.NOT_EXIST);
            }
            const isCheckCCCD = await CommonService.checkCCCDUserExist(CCCD, role);
            if (isCheckCCCD && isCheckCCCD.id !== teacherId) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                    EnumMessage.ALREADY_EXIST);
            }
            const isUpdate = await TeacherService.updateTeacher(teacherId, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, departmentId, address);
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
    async deleteTeacher(req, res) {
        const teacherId = req.params.teacher_id;
        if (!teacherId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
             const isDelete = await TeacherService.deleteTeacher(teacherId, transaction);
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
    async addTeachersToClassroom(req, res) {
        const teacherIds = req.body.teacher_ids;
        const classroomId = req.body.classroom_id;
        if (teacherIds.length === EnumServerDefinitions.EMPTY || !classroomId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            const classroom = await ClassroomService.checkClassroomExist(classroomId);
            if (!classroom) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.ERROR_CLASSROOM.CLASSROOM_NOT_EXISTS);
            } 
            const newTeacherToClassroom = await ClassroomTeacherService.addTeachersToClassroom(teacherIds, classroomId, transaction);
            await transaction.commit();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, newTeacherToClassroom);
        } catch (error) {
            await transaction.rollback();
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async removeTeachersFromClassroom(req, res) {
        const teacherIds = req.body.teacher_ids;
        const classroomId = req.body.classroom_id;
        if (teacherIds.length === EnumServerDefinitions.EMPTY || !classroomId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            const isRemove = await ClassroomTeacherService.removeTeachersFromClassroom(classroomId, teacherIds);
            if (!isRemove) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ERROR_DELETE);
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

module.exports = new TeacherController;