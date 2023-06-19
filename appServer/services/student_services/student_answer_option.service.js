const StudentAnswerOption = require("../../models/student_answer_option.model");

class StudentAnswerOptionService {
    async createStudentAnswerOption(listQuestionAndAnswerIds, studentExamId, transaction) {
        try {
            const listStudentAnswerOption = listQuestionAndAnswerIds.map(item => ({
                ...item,
                student_exam_id: studentExamId
            }));
            const newStudentAnswerOption = await StudentAnswerOption.bulkCreate(listStudentAnswerOption, { transaction });
            return newStudentAnswerOption;
        } catch (error) {
            throw error;
        }
    }
}