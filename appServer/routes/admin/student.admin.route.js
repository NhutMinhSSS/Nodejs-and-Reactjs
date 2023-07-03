const express = require('express');
const StudentAdminRouter = express.Router();
const StudentController = require('../../controllers/student.controller');

StudentAdminRouter.get('/', StudentController.getAllStudentInit);
StudentAdminRouter.get('/get-students-not-in-classroom/:classroom_id/:regular_class_id', StudentController.getStudentsListNotInClassroom);
StudentAdminRouter.post('/add-students-to-classroom', StudentController.addStudentsToClassroom);
StudentAdminRouter.patch('/remove-students-from-classroom', StudentController.removeStudentsFromClassroom);

module.exports = StudentAdminRouter;