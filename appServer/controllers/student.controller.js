const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const FileService = require("../services/file_service/file.service");
const ServerResponse = require("../common/utils/server_response");
const logger = require("../config/logger.config");
const RegularClassService = require("../services/regular_class.service");
const StudentService = require("../services/student_services/student.service");
const StudentExamService = require("../services/student_services/student_exam.service");
const StudentFileSubmissionService = require("../services/student_services/student_file_submission.service");
const ClassroomStudentService = require("../services/classroom_services/classroom_student.service");
const db = require("../config/connect_database.config");
const FormatUtils = require("../common/utils/format.utils");
const PostService = require("../services/post_services/post.service");
const PostDetailService = require("../services/post_services/post_detail.service");
const sequelize = db.getPool();


class StudentController {
    async getAllStudentInit(req, res) {
        try {
            const students = await StudentService.findAllStudents();
            const result = students.map(({ id, student_code, first_name, last_name, RegularClass }) => ({
                id,
                student_code,
                first_name,
                last_name,
                class_name: RegularClass.class_name
            }));
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, result);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(
                res,
                SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR,
            );
        }
    }
    async addStudent(req, res) {
        const studentCode = req.body.student_code;
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const dateOfBirth = req.body.date_of_birth;
        const gender = req.body.gender;
        const phoneNumber = req.body.phone_number;
        const regularClassId = req.body.regular_class_id;
        const CCCD = req.body.CCCD;
        const address = req.body.address;
        if (!studentCode || !firstName || !lastName || !dateOfBirth || gender === null || !regularClassId || !CCCD || !address) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                "Required information");
        }
        const role = EnumServerDefinitions.ROLE.STUDENT;
        const email = `${studentCode}@caothang.edu.vn`;
        const transaction = await sequelize.transaction();
        try {
            const checkAccount = await AccountService.checkEmailExist(email);
            if (checkAccount) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                    EnumMessage.ALREADY_EXIST);
            }
            const isCheckCCCD = await CommonService.checkCCCDUserExist(CCCD, role);
            if (isCheckCCCD) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                    EnumMessage.CCCD_ALREADY_EXIST);
            }
            const newAccount = await AccountService.addAccount(email, CCCD, role, transaction);
            await StudentService.addStudent(studentCode, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, newAccount.id, regularClassId, address, transaction);
            await transaction.commit();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
        } catch (error) {
            await transaction.rollback();
            logger.error(error);
            return ServerResponse.createErrorResponse(
                res,
                SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR,
            );
        }
    }
    async updateStudent(req, res) {
        const studentId = req.body.student_id;
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const dateOfBirth = req.body.date_of_birth;
        const gender = req.body.gender;
        const phoneNumber = req.body.phone_number;
        const regularClassId = req.body.regular_class_id;
        const CCCD = req.body.CCCD;
        const address = req.body.address;
        if (!studentId || !firstName || !lastName || !dateOfBirth || gender === null || !phoneNumber || !!regularClassId || !CCCD || !address) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            const regularClass = await RegularClassService.checkRegularClassExist(regularClassId);
            if (!regularClass) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.NOT_EXIST);
            }
            const isCheck = await CommonService.checkCCCDUserExist(CCCD, EnumServerDefinitions.ROLE.STUDENT);
            if (isCheck && isCheck.id !== studentId) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                    EnumMessage.CCCD_ALREADY_EXIST);
            }
            const isUpdate = await StudentService.updateStudent(userId, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, regularClassId, address);
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
    async deleteStudent(req, res) {
        const studentId = req.params.student_id;
        if (!studentId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            const isDelete = await StudentService.deleteStudent(studentId, transaction);
            if (!isDelete) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ERROR_DELETE);
            }
            await transaction.commit();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async addStudentsToClassroom(req, res) {
        const classroomId = req.body.classroom_id;
        const studentIds = req.body.student_ids;
        if (studentIds.length === EnumServerDefinitions.EMPTY || !classroomId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            await ClassroomStudentService.addStudentsToNewClassroom(classroomId, studentIds, transaction);
            const listPosts = await PostService.findAllPostsByClassroomId(classroomId);
            if (listPosts) {
                const publicPosts = listPosts.filter(post => post.post_details.is_public === true);
                if (publicPosts.length > 0) {
                    const studentExams = publicPosts.flatMap(post => studentIds.map(studentId => ({
                      post_id: post.id,
                      student_id: studentId
                    })));
                    await StudentExamService.addStudentExams(studentExams, transaction);
                  }
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
    async studentSubmissionExam(req, res) {
        try {
            const studentId = req.student_id;
            const studentExamId = req.body.student_exam_id;
            const postId = req.post_id;
            const isStudentExam = await StudentExamService.checkStudentExamByIdAndStudentId(studentExamId, studentId);
            if (!isStudentExam) {
                return ServerResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST,
                    EnumMessage.ACCESS_DENIED_ERROR);
            }
            const postDetail = await PostDetailService.findDetailByPostId(postId);
            const isBeforeStartTime = await FormatUtils.checkBeforeStartTime(postDetail.start_time);
            if (isBeforeStartTime) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ERROR_SUBMISSION.BEFORE_START_TIME);
            }
            const isDeadLineExceeded = await FormatUtils.checkDeadlineExceeded(postDetail.finish_date);
            if (isDeadLineExceeded) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ERROR_SUBMISSION.DEADLINE_EXCEEDED);
            }
            if (postCategoryId === EnumServerDefinitions.POST_CATEGORY.EXERCISE) {
                const files = req.files;
                if (files.length === EnumServerDefinitions.EMPTY) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                        'Nộp cc à không có file');
                }
                await this.submissionExercise(studentExamId, submissionDate, files);
            } else if (postCategoryId === EnumServerDefinitions.POST_CATEGORY.EXAM) {
                ///
            } else {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.UNAUTHORIZED_REQUEST,
                    EnumMessage.UNAUTHORIZED_ERROR);
            }
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async submissionExercise(studentExamId, submissionDate, files) {
        const transaction = await sequelize.transaction();
        try {
            const listFiles = FormatUtils.formatFileRequest(files);
            const newFile = await FileService.createFiles(listFiles, transaction);
            const listFileIds = newFile.map(item => item.id);
            const submission = await StudentExamService.updateStudentExam(studentExamId, submissionDate, 0, EnumServerDefinitions.SUBMISSION.NOT_SCORED, transaction);
            if (!submission) {
                throw new Error(EnumMessage.ERROR_SUBMISSION.NOT_SUBMISSION);
            }
            await StudentFileSubmissionService.createStudentFileSubmission(studentExamId, listFileIds, transaction);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async submissionExam() {

    }
}

module.exports = new StudentController;