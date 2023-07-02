const Answer = require("../../models/answer.model");
const Question = require("../../models/question.model");

class QuestionService {
    async addQuestionsAndAnswers(listQuestionsAnswers, transaction) {
        try {
            const questionsAndAnswers = listQuestionsAnswers.map(item => ({
                exam_id: postId,
                ...item
            }));
            const newQuestionAndAnswers = await Question.bulkCreate(questionsAndAnswers, { include: [{
                model: Answer,
                as: 'answers'
            }], transaction });
            return newQuestionAndAnswers;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new QuestionService;