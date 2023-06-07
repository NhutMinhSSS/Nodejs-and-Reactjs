const Post = require("../../models/post.model");
const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");

class PostService {
    async findPostsByClassroomIdAndAccountId(classroomId, accountId) {
        try {
            const listPost = await Post.findAll({
                where: {
                    classroom_id: classroomId,
                    account_id: accountId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return listPost;
        } catch (error) {
            throw error;
        }
    }
    async createPost(title, content, postCategoryId, accountId, classroomId, topicId, transaction) {
        try {
            const newPost = await Post.create({
                title: title,
                content: content,
                post_category_id: postCategoryId,
                account_id: accountId,
                classroom_id: classroomId,
                topic_id: topicId
            }, { transaction: transaction });
            return newPost;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PostService;