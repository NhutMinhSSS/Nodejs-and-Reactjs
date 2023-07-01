const express = require('express');
const StudentAdminRouter = express.Router();
const StudentController = require('../../controllers/student.controller');

StudentAdminRouter.get('/', StudentController.getAllStudentInit);
StudentAdminRouter.get('/get-students-not-in-classroom/:classroom_id', StudentController.getStudentsListNotInClassroom);
StudentAdminRouter.post('/add-student-to-classroom', StudentController.addStudentsToClassroom);

module.exports = StudentAdminRouter;