const PostDetail = require("../../models/post_detail.model");


class PostDetailService {
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
}

module.exports = new PostDetailService;