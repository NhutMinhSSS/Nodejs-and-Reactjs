
const StudentRandomizedAnswerList = require("../../models/student_randomized_answer_list.model");
const StudentRandomizedQuestion = require("../../models/student_randomized_question_list.model");

class StudentRandomizedQuestionService {
    async addRandomizedQuestion(listQuestions) {
        const transaction = await StudentRandomizedQuestion.sequelize.transaction();
        try {
            const newListQuestions = await StudentRandomizedQuestion.bulkCreate(listQuestions, { transaction });
            await transaction.commit();
            return newListQuestions;
        } catch (error) {
            await transaction.rollback()
            throw error;
        }
    }
    async addRandomizedQuestionAndAnswers(listQuestions, listAnswers) {
        const transaction = await StudentRandomizedQuestion.sequelize.transaction();
        try {
            const newListQuestions = await StudentRandomizedQuestion.bulkCreate(listQuestions, { transaction });
            const newListAnswers = await StudentRandomizedAnswerList.bulkCreate(listAnswers, { transaction });
            await transaction.commit();
            return {newListQuestions, newListAnswers};
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new StudentRandomizedQuestionService;