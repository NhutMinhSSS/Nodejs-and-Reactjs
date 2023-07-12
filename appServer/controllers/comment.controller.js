const logger = require("../config/logger.config");
const ServerResponse = require("../common/utils/server_response");
const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const CommentService = require("../services/comment_services/comment.service");
const db = require("../config/connect_database.config");
const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const TeacherService = require("../services/teacher_services/teacher.service");
const StudentService = require("../services/student_services/student.service");
const sequelize = db.getPool();

class CommentController {
    async createComment(req, res) {
        const post = req.post;
        const accountId = req.user.account_id;
        const role = req.user.role;
        const content = req.body.content;
        if (!content) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            const newComment = await CommentService.createComment(post.id, content, accountId, transaction);
            const user = await (role === EnumServerDefinitions.ROLE.TEACHER ?  TeacherService.findTeacherByAccountId(accountId) : StudentService.findStudentByAccountId(accountId));
            const result = {
                ...newComment.dataValues,
                first_name: user.first_name,
                last_name: user.last_name
            }
            await transaction.commit();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, result);
        } catch (error) {
            logger.error(error);
            await transaction.rollback();
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async deleteComment(req, res) {
        const accountId = req.user.account_id;
        const commentId = req.params.comment_id;
        try {
            const isDelete = await CommentService.deleteComment(commentId, )
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
}
module.exports = new CommentController;