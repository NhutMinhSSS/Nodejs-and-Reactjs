const logger = require('../config/logger.config');
const ServerResponse = require('../common/utils/server_response');
const SystemConst = require('../common/consts/system_const');
const EnumMessage = require('../common/enums/enum_message');
const TeacherService = require('../services/teacher_services/teacher.service');
const EnumServerDefinitions = require('../common/enums/enum_server_definitions');
const DepartmentService = require('../services/department.service');
const CommonService = require('../common/utils/common_service');
const sequelize = require('sequelize');

class TeacherController {
    async getAllTeacherInit(req, res) {
        try {
            const teachers = await TeacherService.findAllTeacher();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, teachers);
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
}

module.exports = new TeacherController;