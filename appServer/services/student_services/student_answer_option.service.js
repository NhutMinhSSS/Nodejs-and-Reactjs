const { Op } = require("sequelize");
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
            // if (answerIds && essayAnswer == null) {
            //    if (answerIds.length === existingStudentAnswerOption.length && !existingStudentAnswerOption.essay_answer) {
            //         let index = 0;
            //         for (const item of existingStudentAnswerOption) {
            //             if (item.answer_id !== answerIds[index]) {
            //                 await StudentAnswerOption.update({
            //                     answer_id: answerIds[index]
            //                 }, { where: { id: item.id }, transaction });
            //             }
            //             index++;
            //         }
            //     } else if (answerIds.length > existingStudentAnswerOption.length && !existingStudentAnswerOption.essay_answer) {
            //         let index = 0;
            //         for (const item of existingStudentAnswerOption) {
            //             await StudentAnswerOption.update({
            //                 answer_id: answerIds[index]
            //             }, { where: { id: item.id, answer_id: { [Op.notIn]: answerIds } }, transaction });
            //             index++;
            //         }
            //         let listAnswers = [];
            //         for (let i = existingStudentAnswerOption.length; i <= answerIds.length - 1; i++) {
            //             listAnswers.push({
            //                 question_id: questionId,
            //                 student_exam_id: studentExamId,
            //                 answer_id: answerIds[i]
            //             });
            //         }
            //         await StudentAnswerOption.bulkCreate(listAnswers, { transaction });
            //     } else if (answerIds.length < existingStudentAnswerOption.length && !existingStudentAnswerOption.essay_answer) {
            //         const studentOptionIds = existingStudentAnswerOption.filter(f => !answerIds.includes(f.answer_id)).map(item => item.id);
            //         await StudentAnswerOption.destroy({
            //             where: {
            //                 id: { [Op.in]: studentOptionIds }
            //             }
            //         });
            //     }
            // } else if (existingStudentAnswerOption.length !== EnumServerDefinitions.EMPTY) {
            //     for (const item of existingStudentAnswerOption) {
            //         if (item.essay_answer !== essayAnswer) {
            //           await StudentAnswerOption.update(
            //             { essay_answer: essayAnswer },
            //             {
            //               where: {
            //                 status: EnumServerDefinitions.STATUS.ACTIVE,
            //                 student_exam_id: studentExamId,
            //                 question_id: questionId,
            //               },
            //               transaction
            //             }
            //           );
            //         }
            //       }
            // } else {
            //     await StudentAnswerOption.create({
            //         student_exam_id: studentExamId,
            //         question_id: questionId,
            //         essay_answer: essayAnswer
            //     }, { transaction });
            // }
            // Cập nhật câu trả lời trắc nghiệm
    const updateMultipleChoiceAnswers = async () => {
        let index = 0;
        for (const item of existingStudentAnswerOption) {
          if (item.answer_id !== answerIds[index]) {
            await StudentAnswerOption.update(
              { answer_id: answerIds[index] },
              { where: { id: item.id }, transaction }
            );
          }
          index++;
        }
      };
  
      // Tạo câu trả lời trắc nghiệm mới
      const createMultipleChoiceAnswers = async () => {
        let listAnswers = [];
        for (let i = existingStudentAnswerOption.length; i < answerIds.length; i++) {
          listAnswers.push({
            question_id: questionId,
            student_exam_id: studentExamId,
            answer_id: answerIds[i]
          });
        }
        await StudentAnswerOption.bulkCreate(listAnswers, { transaction });
      };
  
      // Xóa câu trả lời trắc nghiệm không còn tồn tại
      const deleteMultipleChoiceAnswers = async () => {
        const studentOptionIds = existingStudentAnswerOption
          .filter(f => !answerIds.includes(f.answer_id))
          .map(item => item.id);
        await StudentAnswerOption.destroy({
          where: {
            id: { [Op.in]: studentOptionIds }
          }
        });
      };
  
      // Kiểm tra và xử lý câu trả lời trắc nghiệm
      if (answerIds && essayAnswer == null) {
        if (answerIds.length === existingStudentAnswerOption.length && !existingStudentAnswerOption.essay_answer) {
          await updateMultipleChoiceAnswers();
        } else if (answerIds.length > existingStudentAnswerOption.length && !existingStudentAnswerOption.essay_answer) {
          await updateMultipleChoiceAnswers();
          await createMultipleChoiceAnswers();
        } else if (answerIds.length < existingStudentAnswerOption.length && !existingStudentAnswerOption.essay_answer) {
          await deleteMultipleChoiceAnswers();
        }
      }
      
      // Cập nhật câu trả lời tự luận
      if (existingStudentAnswerOption.length !== 0 && essayAnswer !== null) {
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
      } else {
        await StudentAnswerOption.create({
          student_exam_id: studentExamId,
          question_id: questionId,
          essay_answer: essayAnswer
        }, { transaction });
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
}

module.exports = new StudentAnswerOptionService;