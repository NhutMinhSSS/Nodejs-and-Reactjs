const express = require('express');
const ClassroomAdminRouter = express.Router();
const ClassroomController = require('../../controllers/classroom.controller');

ClassroomAdminRouter.get('/', ClassroomController.getAllClassroomsInit);
ClassroomAdminRouter.get('/get-teacher-subject-regularclass', ClassroomController.getTeacherAndSubjectAndRegularClass);
ClassroomAdminRouter.post('/create-classroom', ClassroomController.createClassroom);

module.exports = ClassroomAdminRouter;