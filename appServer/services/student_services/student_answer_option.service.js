const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const Answer = require("../../models/answer.model");
const Question = require("../../models/question.model");
const StudentAnswerOption = require("../../models/student_answer_option.model");

class StudentAnswerOptionService {
    async findAllAnswersByStudentExamId(studentExamId, examId) {
        try {
            const listQuestionsAndAnswersByStudentExam = await Question.findAll({
                where: {
                    exam_id: examId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: [{
                    model: Answer,
                    required: false,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    }
                }, {
                    model: StudentAnswerOption,
                    where: {
                        student_exam_id: studentExamId,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    }
                }]
            });
            return listQuestionsAndAnswersByStudentExam;
        } catch (error) {
            throw error;
        }
    }
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

module.exports = new StudentAnswerOptionService;