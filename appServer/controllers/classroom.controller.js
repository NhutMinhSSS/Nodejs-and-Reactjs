const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const db = require("../config/connect_database.config");
const logger = require("../config/logger.config");
const ServerResponse = require('../common/utils/server_response');
const ClassroomService = require("../services/classroom_services/classroom.service");
const ClassroomTeacherService = require("../services/classroom_services/classroom_teacher.service");
const TeacherService = require("../services/teacher_services/teacher.service");
const StudentService = require("../services/student_services/student.service");
const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const ClassroomStudentService = require("../services/classroom_services/classroom_student.service");
const sequelize = db.getPool();

class ClassroomController {
    async showJoinedClassrooms(req, res) {
        try {
            const role= req.user.role;
            const accountId = req.user.account_id;
            let user;
            let listClassroom;
            if (role === EnumServerDefinitions.ROLE.STUDENT) {
                user = await StudentService.findStudentByAccountId(accountId);
                if (!user) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                        EnumMessage.STUDENT_NOT_EXISTS);
                }
                listClassroom = await ClassroomStudentService.findClassroomsByStudentId(user.id);
            } else if (role === EnumServerDefinitions.ROLE.TEACHER) {
                user = await TeacherService.findTeacherByAccountId(accountId);
                if (!user) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                        EnumMessage.TEACHER_NOT_EXISTS);
                }
                listClassroom = await ClassroomTeacherService.findClassroomsByTeacherId(user.id);
            } else {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ROLE_INVALID);
            }
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, listClassroom);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async joinClassroom(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const role = req.user.role;
            const accountId = req.user.accountId;
            const classCode = req.body.classCode;
            if (!classCode) {
                //Cần sửa nội dung lỗi
                return ServerResponse.createErrorResponse(SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ERROR_CLASSROOM.REQUIRED_CLASS_NAME);
            }
            if (![EnumServerDefinitions.ROLE.STUDENT, EnumServerDefinitions.ROLE.TEACHER].includes(role)) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ROLE_INVALID);
            }
            const classroom = await ClassroomService.findClassroomByClassCode(classCode);
            if (!classroom) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                EnumMessage.ERROR_CLASSROOM.CLASSROOM_NOT_EXISTS);
            }
            if (role === EnumServerDefinitions.ROLE.TEACHER) {
                const teacher = await TeacherService.findTeacherByAccountId(accountId);
                if (!teacher) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                        EnumMessage.TEACHER_NOT_EXISTS);
                }
                const isJoined = await ClassroomTeacherService.isTeacherJoined(classroom.id, teacher.id);
                if (isJoined) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                        EnumMessage.IS_JOINED_CLASSROOM);
                }
                await ClassroomTeacherService.addTeacherToClassroom(classroom.id, teacher.id, transaction);
            } else {
                const student = await StudentService.findStudentByAccountId(accountId);
                if (!student) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                        EnumMessage.STUDENT_NOT_EXISTS);
                }
                const isJoined = await ClassroomStudentService.isStudentJoined(classroom.id, student.id);
                if (isJoined) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                        EnumMessage.IS_JOINED_CLASSROOM);
                }
                await ClassroomStudentService.addStudentToClassroom(classroom.id, student.id, transaction);
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
    async createClassroom(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const className = req.body.nameClass;
            const title = req.body.title || null;
            const note = req.body.note || null;
            const accountId = req.user.account_id;
            //const regularClassId = req.body.selectedClass;
            //const subjectId = req.body.selectedSubject;
            if (!className) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ERROR_CLASSROOM.REQUIRED_CLASS_NAME);
            }
            const newClassroom = await ClassroomService.createClassroom(className, title, note, 1, 1, transaction);
            const teacher = await TeacherService.findTeacherByAccountId(accountId);
            if (!teacher) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.TEACHER_NOT_EXISTS);
            } else {
                await ClassroomTeacherService.addTeacherToClassroom(newClassroom.id, teacher.id, transaction);
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

module.exports = new ClassroomController;