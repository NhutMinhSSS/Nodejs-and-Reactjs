const logger = require("../config/logger.config");
const ServerResponse = require("../common/utils/server_response");
const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const CommentService = require("../services/comment_services/comment.service");
const db = require("../config/connect_database.config");
const sequelize = db.getPool();

class CommentController {
    async createComment(req, res) {
        const post = req.post;
        const accountId = req.user.account_id;
        const content = req.body.content;
        if (!content) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            const newComment = await CommentService.createComment(post.id, content, accountId, transaction);
            await transaction.commit();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, newComment);
        } catch (error) {
            logger.error(error);
            await transaction.rollback();
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
}
module.exports = new CommentController;