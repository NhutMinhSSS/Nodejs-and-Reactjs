const logger = require('../config/logger.config');
const ServerResponse = require('../common/utils/server_response');
const SystemConst = require('../common/consts/system_const');
const EnumMessage = require('../common/enums/enum_message');
const TeacherService = require('../services/teacher_services/teacher.service');
const AccountService = require('../services/account_services/account.service');
const EnumServerDefinitions = require('../common/enums/enum_server_definitions');
const DepartmentService = require('../services/department.service');
const CommonService = require('../common/utils/common_service');
const db = require('../config/connect_database.config');
const ClassroomService = require('../services/classroom_services/classroom.service');
const ClassroomTeacherService = require('../services/classroom_services/classroom_teacher.service');
const StudentExamService = require('../services/student_services/student_exam.service');
const QuestionService = require('../services/question_services/question.service');
const StudentAnswerOptionService = require('../services/student_services/student_answer_option.service');
const sequelize = db.getPool();

class TeacherController {
    async getAllTeacherInit(req, res) {
        try {
            const teachers = await TeacherService.findAllTeachersAndDepartment();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, teachers);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async getTeachersListNotInClassroom(req, res) {
        const classroomId = req.params.classroom_id;
        if (!classroomId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            const classroom = await ClassroomService.checkClassroomExist(classroomId);
            if (!classroom) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.ERROR_CLASSROOM.CLASSROOM_NOT_EXISTS);
            }
            const teacherList = await TeacherService.findTeachersNotInClassroom(classroomId);
            const result = teacherList.map(({ id, first_name, last_name, Department }) => ({
                id,
                first_name,
                last_name,
                department_name: Department.department_name,
            }))
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, result);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async teacherUpdateScoreStudent(req, res) {
        const post = req.post;
        const studentExamId = req.body.student_exam_id;
        if (!studentExamId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        try {
            if ([EnumServerDefinitions.POST_CATEGORY.DOCUMENT, EnumServerDefinitions.POST_CATEGORY.NEWS].includes(post.post_category_id)) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST,
                    EnumMessage.ACCESS_DENIED_ERROR);
            }
            const isStudentExam = await StudentExamService.checkStudentExamByIdAndStudentId(studentExamId);
            if (!isStudentExam || isStudentExam.submission === EnumServerDefinitions.SUBMISSION.UNSENT) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST,
                    EnumMessage.ACCESS_DENIED_ERROR);
            }
            if (post.post_category_id === EnumServerDefinitions.POST_CATEGORY.EXERCISE) {
                const score = req.body.score || 0;
                if (score < 0 && score > 100) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                        EnumMessage.INVALID_SCORE);
                }
                await TeacherController.prototype.scoreForStudentExercise(studentExamId, score);
            } else if (post.post_category_id === EnumServerDefinitions.POST_CATEGORY.EXAM) {
                const listQuestionsAndScores = req.body.list_questions_and_score;
                if (!listQuestionsAndScores || listQuestionsAndScores.length === EnumServerDefinitions.EMPTY) {
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                        EnumMessage.INVALID_SCORE);
                }
                await TeacherController.prototype.scoreForStudentExam(studentExamId, listQuestionsAndScores, post.id);
            }
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async scoreForStudentExercise(studentExamId, score) {
        const transaction = await sequelize.transaction();
        try {
            //chấm tự luận
            //finalScore = (8 + (finalScore * totalScore) /100) / totalScore * 100
            const isUpdate = await StudentExamService.updateStudentExam(studentExamId, null, score, EnumServerDefinitions.SUBMISSION.SUBMITTED, transaction);
            if (!isUpdate) {
                throw new Error("Don't update score");
            }
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async scoreForStudentExam(studentExamId, listQuestionsAndScore, postId) {
        const transaction = await sequelize.transaction();
        try {
            const questionIds = listQuestionsAndScore.map(item => item.question_id);
            const listQuestion = await QuestionService.findQuestionsById(postId);
            const studentExam = await StudentExamService.findStudentExamById(studentExamId);
            let totalScore = 0;
            let finalScore = 0;
            listQuestion.forEach(({ score }) => {
                totalScore += score;
            });
            let preEssayScore = 0;
            if (studentExam.submission === EnumServerDefinitions.SUBMISSION.SUBMITTED) {
                const listEssayQuestions = await StudentAnswerOptionService.findAllEssayQuestionByQuestionId(questionIds, studentExamId);
                listEssayQuestions.forEach(item => {
                    preEssayScore += item.score;
                });
            }
            let essayScore = 0;
            for (const itemQS of listQuestionsAndScore) {
                const itemQ = listQuestion.find(q => q.id === itemQS.question_id);
                if (itemQ) {
                    const score = (itemQS.score / totalScore) * 100;
                    await StudentAnswerOptionService.updateEssayQuestionScore(itemQ.id, itemQS.score, transaction);
                    essayScore += score;
                }
            }
            finalScore = studentExam.total_score - ((preEssayScore / totalScore) * 100) + essayScore;
            const isUpdate = await StudentExamService.updateStudentExam(studentExamId, null, finalScore.toFixed(1), EnumServerDefinitions.SUBMISSION.SUBMITTED, transaction);
            if (!isUpdate) {
                throw new Error("Don't update score");
            }
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async addTeacher(req, res) {
        const teacherCode = req.body.teacher_code;
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const dateOfBirth = req.body.date_of_birth;
        const gender = req.body.gender;
        const phoneNumber = req.body.phone_number;
        const departmentId = req.body.department_id;
        const CCCD = req.body.CCCD;
        const address = req.body.address;
        if (!teacherCode || !firstName || !lastName || !dateOfBirth || gender === null || !departmentId || !CCCD || !address) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                "Required information");
        }
        const role = EnumServerDefinitions.ROLE.TEACHER;
        const email = `${teacherCode}@caothang.edu.vn`;
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
            const department = await DepartmentService.checkDepartmentExist(departmentId);
            if (!department) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.NOT_EXIST);
            }
            const newAccount = await AccountService.addAccount(email, CCCD, role, transaction);
            await TeacherService.addTeacher(teacherCode, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, newAccount.id, departmentId, address, transaction);
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
    async updateTeacher(req, res) {
        const teacherId = req.body.teacher_id;
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const dateOfBirth = req.body.date_of_birth;
        const gender = req.body.gender;
        const phoneNumber = req.body.phone_number;
        const departmentId = req.body.department_id;
        const CCCD = req.body.CCCD;
        const address = req.body.address;
        if (!teacherId || !firstName || !lastName || !dateOfBirth || gender === null || !phoneNumber || !departmentId || !CCCD || !address) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const role = EnumServerDefinitions.ROLE.TEACHER;
        try {
            const department = await DepartmentService.checkDepartmentExist(departmentId);
            if (!department) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.NOT_EXIST);
            }
            const isCheckCCCD = await CommonService.checkCCCDUserExist(CCCD, role);
            if (isCheckCCCD && isCheckCCCD.id !== teacherId) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.CONFLICT,
                    EnumMessage.ALREADY_EXIST);
            }
            const isUpdate = await TeacherService.updateTeacher(teacherId, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, departmentId, address);
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
    async deleteTeacher(req, res) {
        const teacherId = req.params.teacher_id;
        if (!teacherId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            const isDelete = await TeacherService.deleteTeacher(teacherId, transaction);
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
    async addTeachersToClassroom(req, res) {
        const teacherIds = req.body.teacher_ids;
        const classroomId = req.body.classroom_id;
        if (!teacherIds || teacherIds.length === EnumServerDefinitions.EMPTY || !classroomId) {
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
            const newTeacherToClassroom = await ClassroomTeacherService.addTeachersToClassroom(teacherIds, classroomId, transaction);
            await transaction.commit();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, newTeacherToClassroom);
        } catch (error) {
            await transaction.rollback();
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async removeTeachersFromClassroom(req, res) {
        const teacherIds = req.body.teacher_ids;
        const classroomId = req.body.classroom_id;
        if (!teacherIds || teacherIds.length === EnumServerDefinitions.EMPTY || !classroomId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            const isRemove = await ClassroomTeacherService.removeTeachersFromClassroom(classroomId, teacherIds);
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
}

module.exports = new TeacherController;