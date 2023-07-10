const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const Comment = require("../../models/comment.model");

class CommentService {
    async createComment(postId, content, accountId, transaction) {
        try {
            const newComment = await Comment.create({
                post_id: postId,
                account_id: accountId,
                content: content,
            }, {transaction});
            return newComment;
        } catch (error) {
            throw error;
        }
    }
    async deleteComment(commentId, accountId) {
        try {
            const isDelete = await Comment.update({
                status: EnumServerDefinitions.STATUS.ACTIVE
            }, {
                id: commentId,
                account_id: accountId
            });
            return isDelete > EnumServerDefinitions.EMPTY
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CommentService;