const { Op } = require("sequelize");
const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const Answer = require("../../models/answer.model");
const Question = require("../../models/question.model");
const StudentAnswerOption = require("../../models/student_answer_option.model");

class StudentAnswerOptionService {
    async findAllEssayQuestionByQuestionId(ids, studentExamId) {
        try {
            const listQuestion = await StudentAnswerOption.findAll({
                where: {
                    question_id: {[Op.in]: ids},
                    student_exam_id:studentExamId,
                    status: {[Op.in]: [EnumServerDefinitions.STATUS.ACTIVE, 2]}
                },
                attributes: ['id', 'score']
            });
            return listQuestion;
        } catch (error) {
            throw error;
        }
    }
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
    async createStudentAnswerOption(studentExamId, questionId, answerIds, essayAnswer, transaction) {
        try {
            const existingStudentAnswerOption = await StudentAnswerOption.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE,
                    student_exam_id: studentExamId,
                    question_id: questionId,
                },
                attributes: ['id', 'answer_id', 'essay_answer']
            });
            if (answerIds && essayAnswer == null) {
               if (answerIds.length === existingStudentAnswerOption.length && !existingStudentAnswerOption.essay_answer) {
                        if (existingStudentAnswerOption[0].answer_id !== answerIds[0]) {
                            await StudentAnswerOption.update({
                                answer_id: answerIds[0]
                            }, { where: { id: existingStudentAnswerOption[0].id }, transaction });
                    }
                } else if (answerIds.length > existingStudentAnswerOption.length && !existingStudentAnswerOption.essay_answer) {
                    // let index = 0;
                    // for (const item of existingStudentAnswerOption) {
                    //     await StudentAnswerOption.update({
                    //         answer_id: answerIds[index]
                    //     }, { where: { id: item.id, answer_id: { [Op.notIn]: answerIds } }, transaction });
                    //     index++;
                    // }
                    let listAnswers = [];
                    for (let i = existingStudentAnswerOption.length; i <= answerIds.length - 1; i++) {
                        listAnswers.push({
                            question_id: questionId,
                            student_exam_id: studentExamId,
                            answer_id: answerIds[i]
                        });
                    }
                    await StudentAnswerOption.bulkCreate(listAnswers, { transaction });
                } else if (answerIds.length < existingStudentAnswerOption.length && !existingStudentAnswerOption.essay_answer) {
                    const studentOptionIds = existingStudentAnswerOption.filter(f => !answerIds.includes(f.answer_id)).map(item => item.id);
                    await StudentAnswerOption.destroy({
                        where: {
                            id: { [Op.in]: studentOptionIds }
                        }
                    });
                }
            } else if (existingStudentAnswerOption.length === 1 && essayAnswer !== null) {
                    if (existingStudentAnswerOption[0].essay_answer !== essayAnswer) {
                      await StudentAnswerOption.update(
                        { essay_answer: essayAnswer },
                        {
                          where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE,
                            student_exam_id: studentExamId,
                            question_id: questionId,
                          },
                          transaction
                        }
                      );
                    }
            } else if (essayAnswer !== null && existingStudentAnswerOption.length === EnumServerDefinitions.EMPTY){
                await StudentAnswerOption.create({
                    student_exam_id: studentExamId,
                    question_id: questionId,
                    essay_answer: essayAnswer
                }, { transaction });
            } else {
                return false;
            }
            return true
        } catch (error) {
            throw error;
        }
    }


    async createStudentsAnswersOptions(listQuestionAndAnswerIds, studentExamId, transaction) {
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
    async updateEssayQuestionScore(questionId, score, transaction) {
        try {
            const isUpdate = await StudentAnswerOption.update({
                score: score,
                status: 2
            }, {
               where: {
                question_id: questionId,
                status: EnumServerDefinitions.STATUS.ACTIVE
               }, transaction
            });
            return isUpdate > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StudentAnswerOptionService;