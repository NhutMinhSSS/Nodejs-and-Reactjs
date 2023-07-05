const Answer = require("../../models/answer.model");
const Question = require("../../models/question.model");

class QuestionService {
    async addQuestionsAndAnswers(questionDataList, transaction) {
        try {
            // Tạo danh sách câu hỏi
            const createdQuestions = await Question.bulkCreate(questionDataList, { transaction });

            // Tạo danh sách câu trả lời
            const answerDataList = [];
            for (const questionData of questionDataList) {
                if (questionData.question_category_id !== 3 && questionData.answers && questionData.answers.length > 0) {
                    const questionId = createdQuestions.find(q => q.exam_id === questionData.exam_id && q.question === questionData.question)?.id;
                    if (questionId) {
                        const answersWithQuestionId = questionData.answers.map(answerData => ({
                            ...answerData,
                            question_id: questionId,
                        }));
                        answerDataList.push(...answersWithQuestionId);
                    }
                }
            }

            // Tạo câu trả lời
            if (answerDataList.length > 0) {
                await Answer.bulkCreate(answerDataList, { transaction });
            }

            return createdQuestions;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new QuestionService;