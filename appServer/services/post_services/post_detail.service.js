const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const PostDetail = require("../../models/post_detail.model");


class PostDetailService {
    async findDetailByPostId(postId) {
        try {
            const postDetail = await PostDetail.findOne({
                where: {
                    post_id: postId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return postDetail;
        } catch (error) {
            throw error;
        }
    }
    async createPostDetail(postId, startDate, finishDate, invertedQuestion, invertedAnswer, isPublic, transaction) {
        try {
            const newPostDetails = PostDetail.create({
                post_id: postId,
                start_date: startDate,
                finish_date: finishDate,
                inverted_question: invertedQuestion,
                inverted_answer: invertedAnswer,
                is_public: isPublic
            }, { transaction: transaction});
            return newPostDetails;
        } catch (error) {
            throw error;
        } 
    }
    async updatePostDetail(postId, startDate, finishDate, invertedQuestion, invertedAnswer, isPublic, transaction) {
        try {
            const postDetail =  await PostDetail.update({
                start_date: startDate,
                finish_date: finishDate,
                inverted_question: invertedQuestion,
                inverted_answer: invertedAnswer,
                is_public: isPublic
            }, {
                where: {
                    post_id: postId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            return postDetail > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PostDetailService;