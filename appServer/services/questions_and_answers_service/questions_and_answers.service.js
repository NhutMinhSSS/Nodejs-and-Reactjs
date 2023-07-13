const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const Answer = require("../../models/answer.model");
const Question = require("../../models/question.model");
const StudentRandomizedAnswerList = require("../../models/student_randomized_answer_list.model");
const StudentRandomizedQuestionList = require("../../models/student_randomized_question_list.model");
const StudentAnswerOption = require("../../models/student_answer_option.model");
const { Op } = require("sequelize");

class QuestionsAndAnswersService {
    async findQuestionsAndAnswersByExamId(examId, randomQuestions = false, studentExamId = null, submission = false) {
        try {
            const questionsOrder = randomQuestions ? Question.sequelize.random() : ['id'];
            const attributes = ['id', 'question_id', 'answer'];
            if (!studentExamId || submission) {
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
                    attributes: ['question_id'],
                    order: [['order', 'ASC']],
                }, {
                    model: Answer,
                    required: false,
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
            const result = listQuestionAndAnswer.map(({ id, content, score, question_category_id, answers, student_answer_options }) => ({
                id,
                content,
                score,
                question_category_id,
                answers,
                student_answer_options
            }));
            return result;
        } catch (error) {
            throw error;
        }
    }
    async findQuestionsAndAnswersRandomizedByExamId(studentExamId, postId) {
        try {
            const checkRandomAnswer = await StudentRandomizedAnswerList.findOne({
                where: {
                    student_exam_id: studentExamId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            if (!checkRandomAnswer) {
                return [];
            }
            const listQuestionAndAnswer = await Question.findAll({
                where: {
                    exam_id: postId,
                    status: EnumServerDefinitions.STATUS.ACTIVE,
                },
                include: [{
                    model: StudentRandomizedAnswerList,
                    required: false,
                    where: {
                        student_exam_id: studentExamId,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    include: [{
                        model: Answer,
                        required: true,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: ['id', 'question_id', 'answer', 'correct_answer']
                    }],
                    attributes: ['id'],
                    order: [['order', 'ACS']]
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
            const result = listQuestionAndAnswer.map(({ id, content, score, question_category_id, StudentRandomizedAnswerLists, student_answer_options }) => ({
                id,
                content,
                score,
                question_category_id,
                answers: StudentRandomizedAnswerLists.map(item => item.Answer),
                student_answer_options
            }));

            return result;
        } catch (error) {
            throw error;
        }
    }
    async findQuestionsRandomizedAndAnswersRandomizedByExamId(studentExamId, postId) {
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
                        exam_id: postId,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    include: [{
                        model: StudentRandomizedAnswerList,
                        required: false,
                        where: {
                            student_exam_id: studentExamId,
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        include: [{
                            model: Answer,
                            required: true,
                            where: {
                                status: EnumServerDefinitions.STATUS.ACTIVE
                            },
                            attributes: ['id', 'question_id', 'answer', 'correct_answer']
                        }],
                        attributes: ['id'], //cần thêm
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
            const question = listQuestionAndAnswer.map(item => item.Question);
            const result = question.map(({ id, content, score, question_category_id, StudentRandomizedAnswerLists, student_answer_options }) => ({
                    id,
                content,
                score,
                question_category_id,
                answers: StudentRandomizedAnswerLists.map(item => item.Answer),
                student_answer_options
                }));
            return result;
        } catch (error) {
            throw error;
        }
    }
    async checkAnswersBeLongToQuestion(questionId, listAnswersId) {
        try {
            const isCheck = await Answer.count({
                where: {
                    id: Array.isArray(listAnswersId) ? { [Op.in]: listAnswersId } : listAnswersId,
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
    async findAllEssayQuestions(postId, studentExamId) {
        try {
            const listEssayQuestionAndAnswer = Question.findAll({
                where: {
                    exam_id: postId,
                question_category_id: 3,
                status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: {
                    model: StudentAnswerOption,
                    required: false,
                    where: {
                        student_exam_id: studentExamId,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['id', 'essay_answer'],
                    as: 'student_answer_options'
                },
                attributes: ['id', 'content', 'question_category_id', 'score']
            });
            return listEssayQuestionAndAnswer;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new QuestionsAndAnswersService;