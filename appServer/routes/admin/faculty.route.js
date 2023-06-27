
const express = require('express');
const FacultyRouter = express.Router();
const FacultyController = require('../../controllers/faculty.controller');

FacultyRouter.get('/', FacultyController.getAllFacultiesInit);
FacultyRouter.get('/get-faculties', FacultyController.getListFaculties);
FacultyRouter.post('/create-faculty', FacultyController.addFaculty);
FacultyRouter.patch('/update-faculty', FacultyController.updateFaculty);
FacultyRouter.delete('/delete-faculty/:faculty_id', FacultyController.deleteFaculty);

module.exports = FacultyRouter;