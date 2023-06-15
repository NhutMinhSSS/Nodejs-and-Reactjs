const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const ClassroomService = require("../services/classroom_services/classroom.service");
const StudentService = require("../services/student_services/student.service");
const TeacherService = require("../services/teacher_services/teacher.service");
const ServerResponse = require('../common/utils/server_response');
const SystemConst = require('../common/consts/system_const');
const EnumMessage = require("../common/enums/enum_message");
const logger = require("../config/logger.config");
const checkRoomMember = async (req, res, next) => {
    try {
        const classroomId = req.params.classroom_id || req.body.classroom_id;
        const accountId = req.user.account_id;
        const role = req.user.role;
        const user = role === EnumServerDefinitions.ROLE.TEACHER
            ? await TeacherService.findTeacherByAccountId(accountId)
            : await StudentService.findStudentByAccountId(accountId);
            if (!user) {
                const errorMessage = role === EnumServerDefinitions.ROLE.TEACHER
                  ? EnumMessage.TEACHER_NOT_EXISTS
                  : EnumMessage.STUDENT_NOT_EXISTS;
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND, errorMessage);
              }
        const classroom = await ClassroomService.findClassroomById(classroomId);
        if (!classroom) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND, EnumMessage.ERROR_CLASSROOM.CLASSROOM_NOT_EXISTS);
        }
        const isCheckRoom = await ClassroomService.checkRoomMember(classroomId, user.id, role);
        if (!isCheckRoom) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST,
                EnumMessage.NO_PERMISSION);
        }
        next();
    } catch (error) {
        logger.error(error);
        return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
            EnumMessage.DEFAULT_ERROR);
    }
}

module.exports = checkRoomMember;