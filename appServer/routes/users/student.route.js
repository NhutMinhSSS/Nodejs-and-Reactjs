const express = require('express');
const StudentController = require('../../controllers/student.controller');
const checkPostBelongToClassroom = require('../../middlewares/check_post_classroom.middleware');

const StudentRouter = express.Router();

StudentRouter.post('/submission', checkPostBelongToClassroom, StudentController.studentSubmissionExam);
StudentRouter.patch('/update-answer', StudentController.studentChooseAnswer);

module.exports = StudentRouter;


