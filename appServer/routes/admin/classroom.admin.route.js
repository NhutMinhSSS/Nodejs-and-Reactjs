const express = require('express');
const ClassroomAdminRouter = express.Router();
const ClassroomController = require('../../controllers/classroom.controller');

ClassroomAdminRouter.get('/', ClassroomController.getAllClassroomsInit);
ClassroomAdminRouter.get('/get-classroom-detail/:classroom_id', ClassroomController.getListTeachersAndListStudentsByClassroomId);
ClassroomAdminRouter.get('/get-teachers-subjects-regularclass', ClassroomController.getTeacherAndSubjectAndRegularClass);
ClassroomAdminRouter.post('/create-classroom', ClassroomController.createClassroom);
ClassroomAdminRouter.patch('/update-classroom', ClassroomController.updateClassroom);
ClassroomAdminRouter.patch('/update-status-classroom', ClassroomController.CloseAndActiveClassroom);
ClassroomAdminRouter.patch('/set-storage-classroom', ClassroomController.StorageClassroom);
ClassroomAdminRouter.delete('/delete-classroom/:classroom_id', ClassroomController.deleteClassroom);

module.exports = ClassroomAdminRouter;