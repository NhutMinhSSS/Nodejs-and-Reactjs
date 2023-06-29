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
const CheckStringUtils = require('../common/utils/check_string.utils');

class ClassroomController {
    async getAllClassroomsInit(req, res) {
        try {
            const classrooms = await ClassroomService.findAllClassroom();
            const result = classrooms.map(({ id, class_name, semester, school_year, RegularClass, status }) => ({
                id,
                class_name,
                semester,
                school_year,
                regular_class_name: RegularClass.class_name,
                status
            }));
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, result);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async getListTeachersAndListStudents(req, res) {
        try {
            const classroomId = req.params.classroom_id;
            if (!classroomId) {
                ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.REQUIRED_INFORMATION);
            }
            const listTeachersAndStudents = await ClassroomService.findListTeachersAndListStudentsByClassroomId(classroomId);
            const [Teachers, Students] = listTeachersAndStudents; 
            const result ={
                teachers: Teachers.map(({id, first_name, last_name, Department}) => ({
                    id,
                    first_name,
                    last_name,
                    department_name: Department.department_name
                })),
                students: Students.map(({id, first_name, last_name, RegularClass}) => ({
                    id,
                    first_name,
                    last_name,
                    regular_class_name: RegularClass.class_name
                }))
            };
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, result)
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async getTeacherAndSubjectAndRegularClass(req, res) {
        try {
            const teachers = await TeacherService.findAllTeachers();
            const subjects = await SubjectService.findAllSubject();
            const regularClass = await RegularClassService.findAllRegularClass();
            const response = {
                teachers: teachers,
                subjects: subjects,
                regular_class: regularClass
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
        const className = req.body.class_name;
        const semester = req.body.semester || 1;
        const schoolYear = req.body.school_year || null;
        const teacherId = req.body.teacher_id;
        const regularClassId = req.body.regular_class_id;
        const subjectId = req.body.subject_id;
        if (!className || !regularClassId || !subjectId || !schoolYear) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.ERROR_CLASSROOM.REQUIRED_INFORMATION);
        }
        if (!CheckStringUtils.checkSemester(semester)) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.SEMESTER_INVALID);
        }
        const transaction = await sequelize.transaction();
        try {
            const regularClass = await RegularClassService.findRegularClassById(regularClassId);
            const checkSubjectAndRegularClass = await Promise.all([
                SubjectService.findSubjectByDepartmentId(subjectId, regularClass.department_id),
                teacherId ? TeacherService.findTeacherByDepartmentId(teacherId, regularClass.department_id) : null
            ]);
            const [checkSubjectByDepartment, checkTeacherByDepartment] = checkSubjectAndRegularClass;

            if (!checkSubjectByDepartment) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST, EnumMessage.TEACHER_NOT_SUBJECT);
            }
            if (teacherId && !checkTeacherByDepartment) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST, EnumMessage.TEACHER_NOT_REGULAR_CLASS);
            }
            const newClassroom = await ClassroomService.createClassroom(className, semester, schoolYear, regularClassId, subjectId, transaction);
            if (teacherId) {
                await ClassroomTeacherService.addTeacherToClassroom(newClassroom.id, teacherId, transaction);
            }
            const students = await StudentService.findStudentsByRegularClass(regularClassId);
            if (students.length !== EnumServerDefinitions.EMPTY) {
                await ClassroomStudentService.addStudentsToNewClassroom(newClassroom.id, students, transaction);
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
    async updateClassroom(req, res) {
        const classroomId = req.body.classroom_id;
        const className = req.body.class_name;
        const semester = req.body.semester || 1;
        const schoolYear = req.body.school_year;
        //const regularClassId = req.body.regular_class_id;
        //const subjectId = req.body.subject_id;
        if (!className || !schoolYear) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.ERROR_CLASSROOM.REQUIRED_INFORMATION);
        }
        try {
            // const checkSubjectAndRegularClass = await Promise.all([
            //     SubjectService.checkSubjectExist(subjectId),
            //     RegularClassService.checkRegularClassExist(regularClassId)
            // ]);
            // const [checkSubject, checkRegularClass] = checkSubjectAndRegularClass;
            // if (!checkSubject) {
            //     await transaction.rollback();
            //     return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND, EnumMessage.ERROR_NOT_EXIST.SUBJECT_NOT_EXIST);
            // }
            // if (!checkRegularClass) {
            //     await transaction.rollback();
            //     return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,  EnumMessage.ERROR_NOT_EXIST.REGULAR_CLASS_NOT_EXIST);
            // }
            const isUpdate = await ClassroomService.updateClassroom(classroomId, className, semester, schoolYear);
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
    async CloseAndActiveClassroom(req, res) {
        const classroomId = req.body.classroom_id;
        if (!classroomId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            const isDelete = await ClassroomService.CloseAndActiveClassroom(classroomId);
            if (!isDelete) {
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
    async StorageClassroom(req, res) {
        const classroomId = req.body.classroom_id;
        if (!classroomId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            const isUpdate = await ClassroomService.StorageClassroom(classroomId);
            if (!isUpdate) {
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