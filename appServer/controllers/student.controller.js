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
const AccountService = require("../services/account_services/account.service");
const CommonService = require("../common/utils/common_service");
const FormatUtils = require("../common/utils/format.utils");
const PostService = require("../services/post_services/post.service");
const PostDetailService = require("../services/post_services/post_detail.service");
const ClassroomService = require("../services/classroom_services/classroom.service");
const QuestionsAndAnswersService = require("../services/questions_and_answers_service/questions_and_answers.service");
const StudentAnswerOptionService = require("../services/student_services/student_answer_option.service");
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
    async getStudentsByClassroomId(req, res) {
        //const postId = req.params.post_id;
        const classroomId = req.params.classroom_id;
        try {
            const listStudentExams = await StudentExamService.findStudentsExamsByPostId(3);
            const listStudentClassroom = await ClassroomStudentService.findStudentsByClassroomId(classroomId);
            const listStudentExamId = listStudentExams.map(item => item.student_id);
            const result = {
                list_student_exams: listStudentExamId,
                list_student_classroom: listStudentClassroom
            }
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, result);
        } catch (error) {
            throw error;
        }
    }
    async getStudentsListNotInClassroom(req, res) {
        const classroomId = req.params.classroom_id;
        const regularClassId = req.params.regular_class_id;
        if (!classroomId || !regularClassId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            const classroom = await ClassroomService.checkClassroomExist(classroomId);
            if (!classroom) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.ERROR_CLASSROOM.CLASSROOM_NOT_EXISTS);
            }
            const studentsList = await StudentService.findStudentNotInClassroom(classroomId, regularClassId);
            const result = studentsList.map(({ id, first_name, last_name, RegularClass }) => ({
                id,
                first_name,
                last_name,
                class_name: RegularClass.class_name,
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
        if (!studentIds || studentIds.length === EnumServerDefinitions.EMPTY || !classroomId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            const classroom = await ClassroomService.checkClassroomExist(classroomId);
            if (!classroom) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.ERROR_CLASSROOM.CLASSROOM_NOT_EXISTS);
            }
            await ClassroomStudentService.addStudentsAlterToClassroom(classroomId, studentIds, transaction);
            const listPosts = await PostService.findAllPostsByClassroomId(classroomId);
            if (listPosts) {
                const publicPosts = listPosts.filter(post => post.post_details.is_public === true);
                if (publicPosts.length > EnumServerDefinitions.EMPTY) {
                    const studentExams = publicPosts.flatMap(post => studentIds.map(studentId => ({
                        exam_id: post.id,
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
    async removeStudentsFromClassroom(req, res) {
        const studentIds = req.body.student_ids;
        const classroomId = req.body.classroom_id;
        if (!studentIds || studentIds.length === EnumServerDefinitions.EMPTY || !classroomId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            const isRemove = await ClassroomStudentService.removeStudentsFromClassroom(classroomId, studentIds);
            if (!isRemove) {
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
    async studentSubmissionExam(req, res) {
        try {
            const studentId = req.student_id;
            const accountId = req.user.account_id;
            const post = req.post;
            const studentExamId = req.body.student_exam_id;
            //const studentExam = await StudentExamService.findStudentExam(post.id, studentId);
            const isStudentExam = await StudentExamService.checkStudentExamByIdAndStudentId(studentExamId ? studentExamId : null, studentId);
            if (!isStudentExam) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST,
                    EnumMessage.ACCESS_DENIED_ERROR);
            }
            const postDetail = await PostDetailService.findDetailByPostId(post.id);
            // const isBeforeStartTime = FormatUtils.checkBeforeStartTime(postDetail.start_date);
            // if (isBeforeStartTime) {
            //     return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
            //         EnumMessage.ERROR_SUBMISSION.BEFORE_START_TIME);
            // }
            const isDeadLineExceeded = FormatUtils.checkDeadlineExceeded(postDetail.finish_date);
            if (isDeadLineExceeded) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ERROR_SUBMISSION.DEADLINE_EXCEEDED);
            }
            if (post.post_category_id === EnumServerDefinitions.POST_CATEGORY.EXERCISE) {
                const files = req.files;
                if (files.length === EnumServerDefinitions.EMPTY) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                        'Nộp cc à không có file');
                }
                await StudentController.prototype.submissionExercise(studentExamId, submissionDate, files, accountId);
            } else if (post.post_category_id === EnumServerDefinitions.POST_CATEGORY.EXAM) {
                ///
                await StudentController.prototype.submissionExam(post.id, studentExamId);
            } else {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.UNAUTHORIZED_REQUEST,
                    EnumMessage.UNAUTHORIZED_ERROR);
            }
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async submissionExercise(studentExamId, submissionDate, files, accountId) {
        const transaction = await sequelize.transaction();
        try {
            const listFiles = FormatUtils.formatFileRequest(files, accountId);
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
    async submissionExam(postId, studentExamId) {
        const transaction = await sequelize.transaction();
        try {
            const submissionDate = FormatUtils.dateTimeNow();
            let totalScore = 0; // Biến tích lũy tổng điểm
            const questions = await QuestionsAndAnswersService.findQuestionsAndAnswersByExamId(postId, false, studentExamId);
            questions.forEach(itemQ => {
                const questionScore = itemQ.score; // Điểm của câu hỏi
                totalScore += questionScore; // Cộng điểm của câu hỏi vào tổng điểm
            });
            let finalScore = 0; // Điểm cuối cùng
            let flag = true;
            questions.forEach(itemQ => {
                if (itemQ.question_category_id !== 3) {
                    const isCorrectQuestion = itemQ.answers.filter(item => item.correct_answer).length;
                    const isCorrect = itemQ.answers.reduce((total, itemA) => {
                        const isChosen = itemQ.StudentAnswerOptions.some(item => item.answer_id === itemA.id);
                        return total + (itemA.correct_answer && isChosen ? 1 : 0);
                    }, 0);
                    const questionScore = itemQ.score; // Điểm của câu hỏi
                    finalScore += (isCorrect / isCorrectQuestion) * questionScore; // Cộng điểm của câu hỏi vào điểm cuối cùng
                } else {
                    flag = false;
                }
            });
            finalScore = (finalScore / totalScore) * 100; // Tính điểm cuối cùng bằng số điểm trả lời đúng nhân với 100 và chia cho tổng điểm của tất cả câu hỏi
            //chấm tự luận
            //finalScore = (8 + (finalScore * totalScore) /100) / totalScore * 100
            await StudentExamService.updateStudentExam(studentExamId, submissionDate, finalScore, flag ? EnumServerDefinitions.SUBMISSION.SUBMITTED : EnumServerDefinitions.SUBMISSION.NOT_SCORED, transaction);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async studentChooseAnswer(req, res) {
        const studentExamId = req.body.student_exam_id;
        const questionId = req.body.question_id;
        const answerIds = req.body.answer_ids;
        const essayAnswer = req.body.essay_answer;
        const transaction = await sequelize.transaction();
        try {
            const checkAnswersBelongToQuestion = await QuestionsAndAnswersService.checkAnswersBeLongToQuestion(questionId, answerIds);
            if (!checkAnswersBelongToQuestion) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ERROR_UPDATE);
            }
            const update = await StudentAnswerOptionService.createStudentAnswerOption(studentExamId, questionId, answerIds, essayAnswer, transaction);
            if (!update) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ERROR_UPDATE);
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

module.exports = new StudentController;