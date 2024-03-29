const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const ServerResponse = require("../common/utils/server_response");
const logger = require("../config/logger.config");
const DepartmentService = require("../services/department.service");
const db = require("../config/connect_database.config");
const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const FacultyService = require("../services/faculty.service");
const sequelize = db.getPool();
class DepartmentController {
    async getListDepartments(req, res) {
        try {
            const departments = await DepartmentService.findAllDepartment();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, departments);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async getAllDepartmentsInit(req, res) {
        try {
            const departments = await DepartmentService.findAllDepartmentAndSubjectQuantity();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, departments);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async addDepartment(req, res) {
        const departmentName = req.body.department_name;
        const facultyId = req.body.faculty_id;
        if (!departmentName || !facultyId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            const faculty = await FacultyService.checkExistFacultyById(facultyId);
            if (!faculty) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.NOT_EXIST);
            }
            const department = await DepartmentService.findDepartmentByName(departmentName);
            if (department) {
                if (department.status === EnumServerDefinitions.STATUS.ACTIVE) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                        EnumMessage.ALREADY_EXIST);
                }
                const isUpdate = await DepartmentService.activeDepartment(department.id, departmentName, facultyId);
                if (!isUpdate) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                        EnumMessage.ERROR_CREATE);
                }
            } else {
                await DepartmentService.addDepartment(departmentName, facultyId);
            }
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async updateDepartment(req, res) {
        const departmentId = req.body.department_id;
        const departmentName = req.body.department_name;
        //const facultyId = req.body.faculty_id;
        if (!departmentId || !departmentName) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            // const faculty = await FacultyService.checkExistFacultyById(facultyId);
            // if (!faculty) {
            //     return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
            //         EnumMessage.NOT_EXIST);
            // }
            const department = await DepartmentService.findDepartmentByName(departmentName);
            if (department && department.id !== departmentId) {
                let message = EnumMessage.ALREADY_EXIST;
                if (department.status === EnumServerDefinitions.STATUS.NO_ACTIVE) {
                    message = EnumMessage.ALREADY_EXIST_NO_ACTIVE;
                }
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                    message);
            }
            const isUpdate = await DepartmentService.updateDepartment(departmentId, departmentName);
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
    async deleteDepartment(req, res) {
        const departmentId = req.params.department_id;
        if (!departmentId) {
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            const isDelete = await DepartmentService.deleteDepartment(departmentId, transaction);
            if (!isDelete) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.DEFAULT_ERROR);
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

module.exports = new DepartmentController;