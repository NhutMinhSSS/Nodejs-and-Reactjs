const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const FileService = require("../services/file_service/file.service");
const ServerResponse = require("../common/utils/server_response");
const logger = require("../config/logger.config");
const StudentExamService = require("../services/student_services/student_exam.service");
const StudentFileSubmissionService = require("../services/student_services/student_file_submission.service");
const db = require("../config/connect_database.config");
const FormatUtils = require("../common/utils/format.utils");
const PostDetailService = require("../services/post_services/post_detail.service");
const sequelize = db.getPool();


class StudentController {
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