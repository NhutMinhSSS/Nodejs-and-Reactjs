const express = require('express');
const checkPostBelongToClassroom  = require('../../middlewares/check_post_classroom.middleware');
const TeacherRouter = express.Router();
const authorize = require('../../middlewares/authorize.middleware');
const TeacherController = require('../../controllers/teacher.controller');
const QuestionController = require('../../controllers/question.controller');
const EnumServerDefinitions = require('../../common/enums/enum_server_definitions');

TeacherRouter.get('/:student_exam_id/:post_id/get-list-essay-question', authorize([EnumServerDefinitions.ROLE.TEACHER]),checkPostBelongToClassroom, QuestionController.getListEssayQuestion);
TeacherRouter.put('/score-for-student', authorize([EnumServerDefinitions.ROLE.TEACHER]), checkPostBelongToClassroom, TeacherController.teacherUpdateScoreStudent);

module.exports = TeacherRouter;