const express = require('express');
const ClassroomAdminRouter = express.Router();
const ClassroomController = require('../../controllers/classroom.controller');

ClassroomAdminRouter.get('/', ClassroomController.getAllClassroomsInit);
classroomRouter.get('/get-teacher-subject-regularclass', ClassroomController.getTeacherAndSubjectAndRegularClass);
ClassroomAdminRouter.get('/get-classrooms');
ClassroomAdminRouter.post('/create-classroom', ClassroomController.createClassroom);

module.exports = ClassroomAdminRouter;