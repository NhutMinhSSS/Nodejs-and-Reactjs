const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const ServerResponse = require("../common/utils/server_response");
const logger = require("../config/logger.config");
const FacultyService = require("../services/faculty.service");
const db = require("../config/connect_database.config");
const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const sequelize = db.getPool();
class FacultyController {
    async getAllFaculties(req, res) {
        try {
            const faculties = await FacultyService.findAllFacultyAnDepartmentQuantity();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, faculties);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async addFaculty(req, res) {
        const facultyName = req.body.faculty_name;
        if (!facultyName) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            const faculty = await FacultyService.findFacultyByName(facultyName);
            if (faculty) {
                if (faculty.status === EnumServerDefinitions.STATUS.ACTIVE) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                        EnumMessage.ALREADY_EXIST);
                }
                const isUpdate = await FacultyService.activeFaculty(faculty.id, facultyName);
                if (!isUpdate) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                        EnumMessage.ERROR_CREATE);
                }
            } else {
                await FacultyService.addFaculty(facultyName);
            }
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async updateFaculty(req, res) {
        const facultyId = req.body.faculty_id;
        const facultyName = req.body.faculty_name;
        if (!facultyName || !facultyId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            const faculty = await FacultyService.findFacultyByName(facultyName);
            if (faculty && faculty.id !== facultyId) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                    EnumMessage.ALREADY_EXIST);
            }
            const isUpdate = await FacultyService.updateFaculty(facultyId, facultyName);
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
    async deleteFaculty(req, res) {
        const facultyId = req.params.faculty_id;
        if (!facultyId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            const isDelete = await FacultyService.deleteFaculty(facultyId, transaction);
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

module.exports = new FacultyController;