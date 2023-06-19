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
const PostService = require("../services/post_services/post.service");
const StudentExamService = require("../services/student_services/student_exam.service");
const SubjectService = require("../services/subject.service");
const RegularClassService = require("../services/regular_class.service");
const sequelize = db.getPool();

class ClassroomController {
    async showJoinedClassrooms(req, res) {
        try {
            const role = req.user.role;
            const accountId = req.user.account_id;
            let user;
            let listClassroom;
            if (role === EnumServerDefinitions.ROLE.STUDENT) {
                user = await StudentService.findStudentByAccountId(accountId);
                // if (!user) {
                //     return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                //         EnumMessage.STUDENT_NOT_EXISTS);
                // }
                listClassroom = await ClassroomStudentService.findClassroomsByStudentId(user.id);
            } else {
                user = await TeacherService.findTeacherByAccountId(accountId);
                // if (!user) {
                //     return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                //         EnumMessage.TEACHER_NOT_EXISTS);
                // }
                listClassroom = await ClassroomTeacherService.findClassroomsByTeacherId(user.id);
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
            // if (![EnumServerDefinitions.ROLE.STUDENT, EnumServerDefinitions.ROLE.TEACHER].includes(role)) {
            //     return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
            //         EnumMessage.ROLE_INVALID);
            // }
            const classroom = await ClassroomService.findClassroomByClassCode(classCode);
            if (!classroom) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.ERROR_CLASSROOM.CLASSROOM_NOT_EXISTS);
            }
            if (role === EnumServerDefinitions.ROLE.TEACHER) {
                const teacher = await TeacherService.findTeacherByAccountId(accountId);
                // if (!teacher) {
                //     return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                //         EnumMessage.TEACHER_NOT_EXISTS);
                // }
                const isJoined = await ClassroomTeacherService.isTeacherJoined(classroom.id, teacher.id);
                if (isJoined) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                        EnumMessage.IS_JOINED_CLASSROOM);
                }
                await ClassroomTeacherService.addTeacherToClassroom(classroom.id, teacher.id, transaction);
            } else {
                const student = await StudentService.findStudentByAccountId(accountId);
                // if (!student) {
                //     return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                //         EnumMessage.STUDENT_NOT_EXISTS);
                // }
                const isJoined = await ClassroomStudentService.isStudentJoined(classroom.id, student.id);
                if (isJoined) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                        EnumMessage.IS_JOINED_CLASSROOM);
                }
                await ClassroomStudentService.addStudentToClassroom(classroom.id, student.id, transaction);
                const listPosts = await PostService.findAllPostsByClassroomId(classroom.id);
                if (listPosts) {
                    const listStudentIds = listPosts.filter(post => post.post_details.is_public === true).map(post => post.id);
                    //create student exam
                    await StudentExamService.addStudentExams(listStudentIds, transaction);
                }
                //update student exam private
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
            const regularClassId = req.body.selectedClass;
            const subjectId = req.body.selectedSubject;
            if (!className) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ERROR_CLASSROOM.REQUIRED_CLASS_NAME);
            }
            const teacher = await TeacherService.findTeacherByAccountId(accountId);
            // if (!teacher) {
            //     return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
            //         EnumMessage.TEACHER_NOT_EXISTS);
            // }
            const checkSubjectAndRegularClass = await Promise.all([
                SubjectService.findSubjectByDepartmentId(subjectId, teacher.department_id),
                RegularClassService.findRegularClassByDepartmentId(regularClassId, teacher.department_id)
            ]);
            const [checkSubject, checkRegularClass] = checkSubjectAndRegularClass;

            if (checkSubject) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST, EnumMessage.TEACHER_NOT_SUBJECT);
            }
            if (checkRegularClass) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST, EnumMessage.TEACHER_NOT_REGULAR_CLASS);
            }
            const newClassroom = await ClassroomService.createClassroom(className, title, note, regularClassId, teacher.id, subjectId, transaction);
            await ClassroomTeacherService.addTeacherToClassroom(newClassroom.id, teacher.id, transaction);
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