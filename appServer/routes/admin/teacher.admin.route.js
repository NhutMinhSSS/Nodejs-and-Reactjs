const express = require('express');
const TeacherAdminRouter = express.Router();
const TeacherController = require('../../controllers/teacher.controller')

TeacherAdminRouter.get('/', TeacherController.getAllTeacherInit);

module.exports = TeacherAdminRouter;
