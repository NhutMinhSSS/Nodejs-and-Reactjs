const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const logger = require("../config/logger.config");
const ServerResponse = require("../common/utils/server_response");
const PostService = require("../services/post_services/post.service");
const QuestionsAndAnswersService = require("../services/questions_and_answers_service/questions_and_answers.service");
const PostDetailService = require("../services/post_services/post_detail.service");
const StudentExamService = require("../services/student_services/student_exam.service");
const StudentRandomizedQuestionService = require("../services/student_services/student_randomized_question_list.service");
const FormatUtils = require("../common/utils/format.utils");
const StudentRandomizedAnswerListService = require("../services/student_services/student_randomized_answers_list.service");
class QuestionController {
  async getQuestionAndAnswer(req, res) {
    const post = req.post;
    const role = req.user.role;

    if (!post.id) {
      return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST, EnumMessage.REQUIRED_INFORMATION);
    }
    //const transaction = await sequelize.transaction();
    try {
      if (post.post_category_id !== EnumServerDefinitions.POST_CATEGORY.EXAM) {
        //await transaction.rollback();
        return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST, EnumMessage.ERROR_POST.POST_NOT_CATEGORY);
      }
      let studentExamId;
      let submission;
      let listQuestionsAndAnswers = [];
      if (role === EnumServerDefinitions.ROLE.TEACHER) {
        studentExamId = req.body.student_exam_id;
        listQuestionsAndAnswers = await QuestionsAndAnswersService.findQuestionsAndAnswersByExamId(post.id, false, studentExamId);
      } else {
        const postDetail = await PostDetailService.findDetailByPostId(post.id);
        const studentId = req.student_id;
        const studentExam = await StudentExamService.findStudentExam(post.id, studentId);
        if (!studentExam) {
          //await transaction.rollback();
          return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST, EnumMessage.ACCESS_DENIED_ERROR);
        }
        const isBeforeStartTime = FormatUtils.checkBeforeStartTime(postDetail.start_date);
        if (isBeforeStartTime) {
          return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
            EnumMessage.ERROR_SUBMISSION.BEFORE_START_TIME);
        }
        listQuestionsAndAnswers = await QuestionsAndAnswersService.findQuestionsAndAnswersByExamId(post.id, postDetail.inverted_question, studentExam.id);
        if (postDetail.inverted_question || postDetail.inverted_answer) {
          let listQuestionsAndAnswersTemp = [];
          if (postDetail.inverted_question && !postDetail.inverted_answer) {
            listQuestionsAndAnswersTemp = await QuestionsAndAnswersService.findQuestionsRandomizedAndAnswersByStudentExamId(studentExam.id);
            if (listQuestionsAndAnswersTemp.length === EnumServerDefinitions.EMPTY) {
              const randomQuestions = FormatUtils.randomQuestions(listQuestionsAndAnswers, studentExam);
              //random questions
              await StudentRandomizedQuestionService.addRandomizedQuestion(randomQuestions);
              listQuestionsAndAnswers = await QuestionsAndAnswersService.findQuestionsRandomizedAndAnswersByStudentExamId(studentExam.id);
            } else {
              listQuestionsAndAnswers = listQuestionsAndAnswersTemp;
            }
          } else if (!postDetail.inverted_question && postDetail.inverted_answer) {
            listQuestionsAndAnswersTemp = await QuestionsAndAnswersService.findQuestionsAndAnswersRandomizedByExamId(studentExam.id, post.id);
            if (listQuestionsAndAnswersTemp.length === EnumServerDefinitions.EMPTY) {
              const randomAnswers = FormatUtils.randomAnswers(listQuestionsAndAnswers, studentExam);
              //random answers
              await StudentRandomizedAnswerListService.addRandomizedAnswers(randomAnswers);
              listQuestionsAndAnswers = await QuestionsAndAnswersService.findQuestionsAndAnswersRandomizedByExamId(studentExam.id, post.id);
            } else {
              listQuestionsAndAnswers = listQuestionsAndAnswersTemp;
            }
          } else if (postDetail.inverted_question && postDetail.inverted_answer) {
            listQuestionsAndAnswersTemp = await QuestionsAndAnswersService.findQuestionsRandomizedAndAnswersRandomizedByExamId(studentExam.id, post.id);
            if (listQuestionsAndAnswersTemp.length === EnumServerDefinitions.EMPTY) {
              const randomQuestions = FormatUtils.randomQuestions(listQuestionsAndAnswers, studentExam);
              const randomAnswers = FormatUtils.randomAnswers(listQuestionsAndAnswers, studentExam);
              //random questions and answers
              await StudentRandomizedQuestionService.addRandomizedQuestionAndAnswers(randomQuestions, randomAnswers);
              listQuestionsAndAnswers = await QuestionsAndAnswersService.findQuestionsRandomizedAndAnswersRandomizedByExamId(studentExam.id, post.id);
            } else {
              listQuestionsAndAnswers = listQuestionsAndAnswersTemp;
            }
          }
        }
        studentExamId = studentExam.id;
        submission = studentExam.submission;
      }
      const result = {
        list_questions_answers: listQuestionsAndAnswers
      }
      if (studentExamId) {
        result.student_exam_id = studentExamId,
        result.submission = submission
      }
      //await transaction.commit();
      return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, result);
    } catch (error) {
      //await transaction.rollback();
      logger.error(error);
      return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER, EnumMessage.DEFAULT_ERROR);
    }
  }
}
module.exports = new QuestionController;

