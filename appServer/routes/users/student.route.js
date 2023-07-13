const express = require('express');
const StudentController = require('../../controllers/student.controller');
const checkPostBelongToClassroom = require('../../middlewares/check_post_classroom.middleware');
const { upload } = require('../../middlewares/upload_and_download_file.middleware');
const authorize = require('../../middlewares/authorize.middleware');
const EnumServerDefinitions = require('../../common/enums/enum_server_definitions');

const StudentRouter = express.Router();

StudentRouter.post('/submission', authorize([EnumServerDefinitions.ROLE.STUDENT]), upload.array('files'),checkPostBelongToClassroom, StudentController.studentSubmissionExam);
StudentRouter.patch('/update-answer', authorize([EnumServerDefinitions.ROLE.STUDENT]), StudentController.studentChooseAnswer);
StudentRouter.patch('/:notification_id/student-read-notification', authorize([EnumServerDefinitions.ROLE.STUDENT]), StudentController.studentReadNotification);

module.exports = StudentRouter;


