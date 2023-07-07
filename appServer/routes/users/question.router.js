
const express = require('express');
const QuestionRouter = express.Router();
const QuestionController = require('../../controllers/question.controller');
const checkPostBelongToClassroom = require('../../middlewares/check_post_classroom.middleware');

QuestionRouter.get('/:post_id/get-questions-and-answers', checkPostBelongToClassroom, QuestionController.getQuestionAndAnswer);

module.exports = QuestionRouter;