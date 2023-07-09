const { Op } = require("sequelize");
const Answer = require("../../models/answer.model");
const Question = require("../../models/question.model");

class QuestionService {
    async addQuestionsAndAnswers(questionDataList, postId, transaction) {
        try {
            const DataList = questionDataList.map((item) => {
                const { answers, ...questionData } = item;
                let extractedAnswers = null;
              
                if (answers && answers.length > 0) {
                  // Trích xuất các trường mong muốn từ answers
                  extractedAnswers = answers.map(({ answer, correct_answer }) => ({
                    answer,
                    correct_answer,
                  }));
                }
                return {
                  exam_id: postId,
                  ...questionData,
                  ...(questionData.question_category_id !== 3 && extractedAnswers && { answers: extractedAnswers }),
                };
              });
            // // Tạo danh sách câu hỏi
            const createdQuestions = await Question.bulkCreate(DataList, {include: [{model: Answer, as: 'answers'}], transaction });
            return createdQuestions;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new QuestionService;