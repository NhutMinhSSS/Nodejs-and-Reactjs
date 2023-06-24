const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const ServerResponse = require("../common/utils/server_response");
const logger = require("../config/logger.config");
const RegularClassService = require("../services/regular_class.service");
const DepartmentService = require("../services/department.service");
const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const db = require("../config/connect_database.config");
const sequelize = db.getPool();

class RegularClassController {
    async getAllRegularClass(req, res) {
        try {
            const regularClass = await RegularClassService.findAllRegularClass();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, regularClass);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async createRegularClass(req, res) {
        const className = req.body.class_name;
        const departmentId = req.body.department_id;
        if (!className || !departmentId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            const department = await DepartmentService.checkDepartmentExist(departmentId);
            if (!department) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.NOT_EXIST);
            }
            const regularClass = await RegularClassService.findRegularClassByName(className);
            if (regularClass) {
                if (regularClass.status === EnumServerDefinitions.STATUS.ACTIVE) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                        EnumMessage.ALREADY_EXIST);
                }
                const isUpdate = await RegularClassService.activeRegularClass(regularClass.id, departmentId);
                if (!isUpdate) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                        EnumMessage.ERROR_CREATE);
                }
                // regularClass.department_id = departmentId;
                // newRegularClass =regularClass;
            } else {
                await RegularClassService.createRegularClass(className, departmentId); 
            }
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async updateRegularClass(req, res) {
        const regularClassId = req.body.regular_class_id;
        const className = req.body.class_name;
        const departmentId = req.body.department_id;
        try {
            const department = await DepartmentService.checkDepartmentExist(departmentId);
            if (!department) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.NOT_EXIST);
            }
            const regularClass = await RegularClassService.findRegularClassByName(className);
            if (regularClass.id !== regularClassId) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                    EnumMessage.ALREADY_EXIST);
            }
            const isUpdate = await RegularClassService.updateRegularClass(regularClassId, className, departmentId);
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
    async deleteRegularClass(req, res) {
        const regularClassId = req.body.regular_class_id;
        if (!regularClassId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            const isDelete = await RegularClassService.deleteRegularClass(regularClassId, transaction);
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

module.exports = new RegularClassController;