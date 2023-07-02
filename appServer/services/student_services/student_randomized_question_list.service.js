
const StudentRandomizedQuestion = require("../../models/student_randomized_question_list.model");

class StudentRandomizedQuestionService {
    async addRandomizedQuestion(listQuestions, transaction) {
        try {
            const newListQuestions = await StudentRandomizedQuestion.bulkCreate(listQuestions, { transaction });
            return newListQuestions;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StudentRandomizedQuestionService;