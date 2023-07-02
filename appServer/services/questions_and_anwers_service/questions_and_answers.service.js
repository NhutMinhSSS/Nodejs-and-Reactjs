const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const Answer = require("../../models/answer.model");
const Question = require("../../models/question.model");
const StudentRandomizedQuestion = require("../../models/student_randomized_question_list.model");


class QuestionsAndAnswersService {
    async findQuestionsAndAnswersByExamId(examId, randomQuestions = false, randomAnswers = false) {
        try {
            const questionsOrder = randomQuestions ? Question.sequelize.random() : [];
            const answersOrder = randomAnswers ? Answer.sequelize.random() : [];
            const questionsAndAnswers = await Question.findAll({
                where: {
                    exam_id: examId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: {
                    model: Answer,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['id', 'answer', 'correct_answer'],
                    as: 'answers',
                    order: answersOrder
                },
                attributes: ['id', 'content', 'score', 'question_category_id', ''],
                order: questionsOrder
            });
            return questionsAndAnswers;
        } catch (error) {
            throw error;
        }
    }
    async findQuestionsRandomizedAndAnswersByExamId(studentExamId) {
        try {
            const listQuestionAndAnswer = await StudentRandomizedQuestion.findAll({
                where: {
                    student_exam_id: studentExamId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: {
                    model: Question,
                    required: true,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    include: [{
                        model: Answer,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: [] //cần thêm
                    }],
                    attributes: [], //cần thêm
                    as: 'answers'
                },
                attributes: [], //cần thêm 
                order: [['order']]
            });
            return listQuestionAndAnswer;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new QuestionsAndAnswersService;