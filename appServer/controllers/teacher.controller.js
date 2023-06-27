const logger = require('../config/logger.config');
const ServerResponse = require('../common/utils/server_response');
const SystemConst = require('../common/consts/system_const');
const EnumMessage = require('../common/enums/enum_message');
const TeacherService = require('../services/teacher_services/teacher.service');

class TeacherController {
    async getAllTeacherInit(req, res) {
        try {
            const teachers = await TeacherService.findAllTeacher();
            return teachers;
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
}

module.exports = new TeacherController;