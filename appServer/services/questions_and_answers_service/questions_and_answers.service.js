const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const Answer = require("../../models/answer.model");
const Question = require("../../models/question.model");
const StudentRandomizedAnswerList = require("../../models/student_randomized_answer_list.model");
const StudentRandomizedQuestionList = require("../../models/student_randomized_question_list.model");
const StudentAnswerOption = require("../../models/student_answer_option.model");
const { Op } = require("sequelize");

class QuestionsAndAnswersService {
    async findQuestionsAndAnswersByExamId(examId, randomQuestions = false, studentExamId = null, submisson = false) {
        try {
            const questionsOrder = randomQuestions ? Question.sequelize.random() : [];
            const attributes = ['id', 'question_id', 'answer'];
            if (!studentExamId || submisson) {
                attributes.push('correct_answer')
            }
            const questionsAndAnswers = await Question.findAll({
                where: {
                    exam_id: examId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: [{
                    model: Answer,
                    required: false,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: attributes,
                    as: 'answers',
                }, {
                    model: StudentAnswerOption,
                    required: false,
                    where: {
                        student_exam_id: studentExamId,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['id', 'question_id', 'answer_id', 'essay_answer', 'student_exam_id'],
                    as: 'student_answer_options'
                }],
                attributes: ['id', 'content', 'score', 'question_category_id'],
                order: questionsOrder,
            });
            return questionsAndAnswers;
        } catch (error) {
            throw error;
        }
    }
    async findQuestionsRandomizedAndAnswersByStudentExamId(studentExamId) {
        try {
            const listQuestionAndAnswer = await Question.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: [{
                    model: StudentRandomizedQuestionList,
                    required: true,
                    where: {
                        student_exam_id: studentExamId,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: [],
                    order: [['order', 'ASC']],
                }, {
                        model: Answer,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: ['id', 'question_id', 'answer', 'correct_answer'],
                    as: 'answers'
                }, {
                    model: StudentAnswerOption,
                    required: false,
                    where: {
                        student_exam_id: studentExamId,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['id', 'question_id', 'answer_id', 'essay_answer', 'student_exam_id'],
                    as: 'student_answer_options'
                }],
                attributes: ['id', 'content', 'score', 'question_category_id'],
            });
            return listQuestionAndAnswer;
        } catch (error) {
            throw error;
        }
    }
    async findQuestionsAndAnswersRandomizedByExamId(studentExamId) {
        try {
            const listQuestionAndAnswer  = await Question.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: [{
                    model: Answer,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    include: [{
                        model: StudentRandomizedAnswerList,
                        where: {
                            student_exam_id: studentExamId,
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: [],
                        order: [['order', 'ACS']]
                    }],
                    attributes: ['id', 'question_id', 'answer', 'correct_answer'],
                    as: 'answers'
                }, {
                    model: StudentAnswerOption,
                    required: false,
                    where: {
                        student_exam_id: studentExamId,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['id', 'question_id', 'answer_id', 'essay_answer', 'student_exam_id'],
                    as: 'student_answer_options'
                }],
                attributes: ['id', 'content', 'score', 'question_category_id'], //cần thêm
            });
            return listQuestionAndAnswer;
        } catch (error) {
            throw error;
        }
    }
    async findQuestionsRandomizedAndAnswersRandomizedByExamId(studentExamId) {
        try {
            const listQuestionAndAnswer = await StudentRandomizedQuestionList.findAll({
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
                        include: [{
                            model: StudentRandomizedAnswerList,
                            where: {
                                status: EnumServerDefinitions.STATUS.ACTIVE
                            },
                            attributes: []
                        }],
                        as: 'answers',
                        attributes: ['id', 'question_id', 'answer', 'correct_answer'], //cần thêm
                        order: [['order', 'ASC']]
                    }, {
                        model: StudentAnswerOption,
                        required: false,
                        where: {
                            student_exam_id: studentExamId,
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: ['id', 'question_id', 'answer_id', 'essay_answer', 'student_exam_id'],
                        as: 'student_answer_options'
                    }],
                    attributes: ['id', 'content', 'score', 'question_category_id'], //cần thêm
                    order: [['order', 'ASC']]
                },
                attributes: ['id']
            });
            return listQuestionAndAnswer.map(item => item.Question);
        } catch (error) {
            throw error;
        }
    }
    async checkAnswersBeLongToQuestion(questionId, listAnswersId) {
        try {
           const isCheck = await Answer.count({
            where: {
                id: Array.isArray(listAnswersId) ? {[Op.in]: listAnswersId} : listAnswersId,
                question_id: questionId,
                status: EnumServerDefinitions.STATUS.ACTIVE
            }
           });
           if (isCheck !== listAnswersId.length && Array.isArray(listAnswersId)) {
            return false;
           }
           return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new QuestionsAndAnswersService;