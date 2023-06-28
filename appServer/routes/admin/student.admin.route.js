const express = require('express');
const StudentAdminRouter = express.Router();
const StudentController = require('../../controllers/student.controller');

StudentAdminRouter.get('/', StudentController.getAllStudentInit);

module.exports = StudentAdminRouter;