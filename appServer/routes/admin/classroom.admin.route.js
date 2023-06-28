const express = require('express');
const ClassroomAdminRouter = express.Router();
const ClassroomController = require('../../controllers/classroom.controller');

ClassroomAdminRouter.get('/', ClassroomController.getAllClassroomsInit);
ClassroomAdminRouter.get('/get-teacher-subject-regularclass', ClassroomController.getTeacherAndSubjectAndRegularClass);
ClassroomAdminRouter.post('/create-classroom', ClassroomController.createClassroom);
ClassroomAdminRouter.patch('/update-classroom', ClassroomController.updateClassroom);
ClassroomAdminRouter.delete('/delete-classroom/:classroom_id', ClassroomController.deleteClassroom);

module.exports = ClassroomAdminRouter;