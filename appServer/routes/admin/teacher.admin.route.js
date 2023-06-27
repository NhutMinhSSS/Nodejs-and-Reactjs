const express = require('express');
const TeacherAdminRouter = express.Router();
const TeacherController = require('../../controllers/teacher.controller');

TeacherAdminRouter.get('/', TeacherController.getAllTeacherInit);
TeacherAdminRouter.post('/create-teacher', TeacherController.addTeacher);
TeacherAdminRouter.patch('/update-teacher', TeacherController.updateTeacher);
TeacherAdminRouter.delete('/delete/:teacher_id', TeacherController.deleteTeacher);

module.exports = TeacherAdminRouter;
