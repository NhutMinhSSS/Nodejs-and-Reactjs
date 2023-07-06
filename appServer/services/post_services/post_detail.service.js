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
    async createPostDetail(postId, startDate, finishDate, invertedQuestion, invertedAnswer, isPublic, isHidden, transaction) {
        try {
            const newPostDetails = PostDetail.create({
                post_id: postId,
                start_date: startDate,
                finish_date: finishDate,
                inverted_question: invertedQuestion,
                inverted_answer: invertedAnswer,
                is_public: isPublic,
                is_hidden: isHidden
            }, { transaction: transaction });
            return newPostDetails;
        } catch (error) {
            throw error;
        }
    }
    async updatePostDetail(postId, startDate, finishDate, invertedQuestion, invertedAnswer, isPublic, transaction) {
        try {
            const updateData = {};

            if (startDate !== null) {
                updateData.start_date = startDate;
            }

            if (finishDate !== null) {
                updateData.finish_date = finishDate;
            }

            if (invertedQuestion !== null) {
                updateData.inverted_question = invertedQuestion;
            }

            if (invertedAnswer !== null) {
                updateData.inverted_answer = invertedAnswer;
            }

            if (isPublic !== null) {
                updateData.is_public = isPublic;
            }
            const postDetail = await PostDetail.update(updateData, {
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