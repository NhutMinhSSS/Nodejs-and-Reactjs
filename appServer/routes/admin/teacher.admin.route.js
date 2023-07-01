const express = require('express');
const TeacherAdminRouter = express.Router();
const TeacherController = require('../../controllers/teacher.controller');

TeacherAdminRouter.get('/', TeacherController.getAllTeacherInit);
TeacherAdminRouter.post('/create-teacher', TeacherController.addTeacher);
TeacherAdminRouter.patch('/update-teacher', TeacherController.updateTeacher);
TeacherAdminRouter.delete('/delete/:teacher_id', TeacherController.deleteTeacher);
TeacherAdminRouter.get('/get-teachers-not-in-classroom/:classroom_id', TeacherController.getTeachersListNotInClassroom);
TeacherAdminRouter.post('/add-teachers-to-classroom', TeacherController.addTeachersToClassroom);
TeacherAdminRouter.put('/remove-teachers-from-classroom', TeacherController.removeTeachersFromClassroom);

module.exports = TeacherAdminRouter;
