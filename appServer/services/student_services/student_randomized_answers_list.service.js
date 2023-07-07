const StudentRandomizedAnswerList = require("../../models/student_randomized_answer_list.model");

class StudentRandomizedAnswerService {
    async addRandomizedAnswers(listAnswers) {
        const transaction = await StudentRandomizedAnswerList.sequelize.transaction();
        try {
            const newListAnswers = await StudentRandomizedAnswerList.bulkCreate(listAnswers, { transaction });
            await transaction.commit();
            return newListAnswers;
        } catch (error) {
            await transaction.rollback()
            throw error;
        }
    }
}

module.exports = new StudentRandomizedAnswerService;