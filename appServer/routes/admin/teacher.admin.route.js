const express = require('express');
const TeacherAdminRouter = express.Router();
const TeacherController = require('../../controllers/teacher.controller');
const UserManager = require('../../common/utils/user_manager');

TeacherAdminRouter.get('/', TeacherController.getAllTeacherInit);
TeacherAdminRouter.post('/create-teacher', UserManager.addStudentOrTeacher);

module.exports = TeacherAdminRouter;
