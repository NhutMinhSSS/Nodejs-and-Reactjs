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
const SubjectService = require("../services/subject.service");
const RegularClassService = require("../services/regular_class.service");
const sequelize = db.getPool();

class ClassroomController {
    async getAllClassroomsInit(req, res) {
        try {
            const classrooms = await ClassroomService.findAllClassroom();
            return classrooms;
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async getTeacherAndSubjectAndRegularClass(req, res) {
        try {
            const teacher = await TeacherService.findAllTeacher();
            const subjects = await SubjectService.findAllSubjectByDepartmentId(teacher.department_id);
            const regularClass = await RegularClassService.findAllRegularClassByDepartmentId(teacher.department_id);
            const listSubject = subjects.map(item => ({
                subject_id: item.id,
                subject_name: item.subject_name
            }));
            const listRegularClass = regularClass.map(item => ({
                regular_class_id: item.id,
                class_name: item.class_name
            }));
            const response = {
                subjects: listSubject,
                regular_class: listRegularClass
            }
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, response);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
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
    // async joinClassroom(req, res) {
    //     const role = req.user.role;
    //     const accountId = req.user.accountId;
    //     const classCode = req.body.classCode;
    //     if (!classCode) {
    //         //Cần sửa nội dung lỗi
    //         return ServerResponse.createErrorResponse(SystemConst.STATUS_CODE.BAD_REQUEST,
    //             EnumMessage.ERROR_CLASSROOM.REQUIRED_CLASS_CODE);
    //     }
    //     const transaction = await sequelize.transaction();
    //     try {
    //         // if (![EnumServerDefinitions.ROLE.STUDENT, EnumServerDefinitions.ROLE.TEACHER].includes(role)) {
    //         //     return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
    //         //         EnumMessage.ROLE_INVALID);
    //         // }
    //         const classroom = await ClassroomService.findClassroomByClassCode(classCode);
    //         if (!classroom) {
    //             return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
    //                 EnumMessage.ERROR_CLASSROOM.CLASSROOM_NOT_EXISTS);
    //         }
    //         if (role === EnumServerDefinitions.ROLE.TEACHER) {
    //             const teacher = await TeacherService.findTeacherByAccountId(accountId);
    //             // if (!teacher) {
    //             //     return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
    //             //         EnumMessage.TEACHER_NOT_EXISTS);
    //             // }
    //             const isJoined = await ClassroomTeacherService.isTeacherJoined(classroom.id, teacher.id);
    //             if (isJoined) {
    //                 return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
    //                     EnumMessage.IS_JOINED_CLASSROOM);
    //             }
    //             await ClassroomTeacherService.addTeacherToClassroom(classroom.id, teacher.id, transaction);
    //         } else {
    //             const student = await StudentService.findStudentByAccountId(accountId);
    //             // if (!student) {
    //             //     return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
    //             //         EnumMessage.STUDENT_NOT_EXISTS);
    //             // }
    //             const isJoined = await ClassroomStudentService.isStudentJoined(classroom.id, student.id);
    //             if (isJoined) {
    //                 return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
    //                     EnumMessage.IS_JOINED_CLASSROOM);
    //             }
    //             await ClassroomStudentService.addStudentToClassroom(classroom.id, student.id, transaction);
    //             const listPosts = await PostService.findAllPostsByClassroomId(classroom.id);
    //             if (listPosts) {
    //                 const listStudentIds = listPosts.filter(post => post.post_details.is_public === true).map(post => post.id);
    //                 //create student exam
    //                 await StudentExamService.addStudentExams(listStudentIds, transaction);
    //             }
    //             //update student exam private
    //         }
    //         await transaction.commit();
    //         return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
    //     } catch (error) {
    //         await transaction.rollback();
    //         logger.error(error);
    //         return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
    //             EnumMessage.DEFAULT_ERROR);
    //     }
    // }
    async createClassroom(req, res) {
        const className = req.body.nameClass;
        const semester = req.body.semester || 1;
        const schoolYear = req.body.school_year || null;
        const accountId = req.user.account_id;
        const regularClassId = req.body.selectedClass;
        const subjectId = req.body.selectedSubject;
        if (!className || !regularClassId || !subjectId || !schoolYear) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.ERROR_CLASSROOM.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            const teacher = await TeacherService.findTeacherByAccountId(accountId);
            const checkSubjectAndRegularClass = await Promise.all([
                SubjectService.findSubjectByDepartmentId(subjectId, teacher.department_id),
                RegularClassService.findRegularClassByDepartmentId(regularClassId, teacher.department_id)
            ]);
            const [checkSubject, checkRegularClass] = checkSubjectAndRegularClass;

            if (!checkSubject) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST, EnumMessage.TEACHER_NOT_SUBJECT);
            }
            if (!checkRegularClass) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST, EnumMessage.TEACHER_NOT_REGULAR_CLASS);
            }
            const newClassroom = await ClassroomService.createClassroom(className, semester, schoolYear, regularClassId, teacher.id, subjectId, transaction);
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
    async updateClassroom(req, res) {
        const classroomId = req.body.classroom_id;
        const className = req.body.class_name;
        const semester = req.body.semester || 1;
        const schoolYear = req.body.school_year;
        const regularClassId = req.body.selectedClass;
        const subjectId = req.body.selectedSubject;
        if (!className || !regularClassId || !subjectId || !schoolYear) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.ERROR_CLASSROOM.REQUIRED_INFORMATION);
        }
        try {
            const checkSubjectAndRegularClass = await Promise.all([
                SubjectService.checkSubjectExist(subjectId),
                RegularClassService.checkRegularClassExist(regularClassId)
            ]);
            const [checkSubject, checkRegularClass] = checkSubjectAndRegularClass;
            if (!checkSubject) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND, EnumMessage.ERROR_NOT_EXIST.SUBJECT_NOT_EXIST);
            }
            if (!checkRegularClass) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,  EnumMessage.ERROR_NOT_EXIST.REGULAR_CLASS_NOT_EXIST);
            }
            const isUpdate = await ClassroomService.updateClassroom(classroomId, className, semester, schoolYear, regularClassId, subjectId);
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
    async deleteClassroom(req, res) {
        const classroomId = req.params.classroom_id;
        if (!classroomId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            const isDelete = await ClassroomService.deleteClassroom(classroomId);
            if (!isDelete) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ERROR_DELETE);
            }
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
}

module.exports = new ClassroomController;