const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const ServerResponse = require("../common/utils/server_response");
const logger = require("../config/logger.config");
const DepartmentService = require("../services/department.service");
const SubjectService = require("../services/subject.service");
const db = require("../config/connect_database.config");
const sequelize = db.getPool();

class SubjectController {
    async getAllSubjects(req, res) {
        try {
            const subjects = await SubjectService.findAllSubjects(true);
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, subjects);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async addSubject(req, res) {
        const subjectName = req.body.subject_name;
        const credit = req.body.credit || 1;
        const departmentId = req.body.department_id;
        if (!subjectName || !departmentId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            const department = await DepartmentService.checkDepartmentExist(departmentId);
            if(!department) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.NOT_EXIST);
            }
            const subject = await SubjectService.findSubjectByName(subjectName);
            if (subject){
                if (subject.status === EnumServerDefinitions.STATUS.ACTIVE) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                        EnumMessage.ALREADY_EXIST);
                }
                const isUpdate = await SubjectService.activeSubject(subject.id, subjectName, departmentId, credit);
                if (!isUpdate) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                        EnumMessage.ERROR_CREATE);
                }
            } else {
                await SubjectService.addSubject(subjectName, departmentId, credit);
            }
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async updateSubject(req, res) {
        const subjectId = req.body.subject_id;
        const subjectName = req.body.subject_name;
        const credit = req.body.credit;
        const departmentId = req.body.department_id;
        if (!subjectId || !subjectName || !departmentId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            const department = await DepartmentService.checkDepartmentExist(departmentId);
            if(!department) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.NOT_EXIST);
            }
            const subject = await SubjectService.findSubjectByName(subjectName);
            if (subject && subject.id !== subjectId){
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                    EnumMessage.ALREADY_EXIST);
            }
            const isUpdate = await SubjectService.updateSubject(subjectId, subjectName, departmentId, credit);
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
    async deleteSubject(req, res) {
        const subjectId = req.params.subject_id;
        if (!subjectId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            const isDelete = await SubjectService.deleteSubject(subjectId, transaction);
            if (!isDelete) {
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

module.exports = new SubjectController;