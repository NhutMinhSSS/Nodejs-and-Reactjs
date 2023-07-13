const { Op } = require("sequelize");
const Answer = require("../../models/answer.model");
const Question = require("../../models/question.model");
const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");

class QuestionService {
  async findQuestionsById(postId) {
    try {
      const listQuestions = await Question.findAll({
        where: {
          //id: {[Op.in]: questionIds},
          exam_id: postId,
          status: EnumServerDefinitions.STATUS.ACTIVE
        },
        attributes: ['id', 'score', 'question_category_id']
      });
      return listQuestions;
    } catch (error) {
      throw error;
    }
  }
  async addQuestionsAndAnswers(questionDataList, postId, transaction) {
    try {
      const DataList = questionDataList.map((item) => {
        const { answers, ...questionData } = item;
        let extractedAnswers = null;

        if (answers && answers.length > 0) {
          // Trích xuất các trường mong muốn từ answers
          extractedAnswers = answers.map(({ answer, correct_answer }) => ({
            answer,
            correct_answer,
          }));
        }
        return {
          exam_id: postId,
          ...questionData,
          ...(questionData.question_category_id !== 3 && extractedAnswers && { answers: extractedAnswers }),
        };
      });
      // // Tạo danh sách câu hỏi
      const createdQuestions = await Question.bulkCreate(DataList, { include: [{ model: Answer, as: 'answers' }], transaction });
      return createdQuestions;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new QuestionService;