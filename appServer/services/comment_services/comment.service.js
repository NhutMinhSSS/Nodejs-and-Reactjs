const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const Comment = require("../../models/comment.model");

class CommentService {
    async findCommentById(commentId) {
        try {
            const comment = await Comment.findOne({
                where: {
                    id: commentId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return comment;
        } catch (error) {
            throw error;
        }
    }
    async createComment(postId, content, accountId, transaction) {
        try {
            const newComment = await Comment.create({
                post_id: postId,
                account_id: accountId,
                content: content,
            }, { transaction });
            return newComment;
        } catch (error) {
            throw error;
        }
    }
    async deleteComment(commentId, accountId) {
        try {
            const isDelete = await Comment.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: commentId,
                    account_id: accountId
                }
            });
            return isDelete > EnumServerDefinitions.EMPTY
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CommentService;