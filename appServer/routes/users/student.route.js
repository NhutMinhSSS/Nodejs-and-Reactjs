const express = require('express');
const StudentController = require('../../controllers/student.controller');
const checkPostBelongToClassroom = require('../../middlewares/check_post_classroom.middleware');
const authorize = require('../../middlewares/authorize.middleware');
const EnumServerDefinitions = require('../../common/enums/enum_server_definitions');

const StudentRouter = express.Router();

StudentRouter.post('/submission', checkPostBelongToClassroom, StudentController.studentSubmissionExam);
StudentRouter.patch('/update-answer', authorize([EnumServerDefinitions.ROLE.STUDENT]), StudentController.studentChooseAnswer);

module.exports = StudentRouter;


