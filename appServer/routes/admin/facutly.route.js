
const express = require('express');
const FacultyRouter = express.Router();
const FacultyController = require('../../controllers/faculty.controller');

FacultyRouter.get('/', FacultyController.getAllFaculties);
FacultyRouter.post('/create-faculty', FacultyController.addFaculty);
FacultyRouter.patch('/update-faculty', FacultyController.updateFaculty);
FacultyRouter.delete('/delete-faculty', FacultyController.deleteFaculty);

module.exports = FacultyRouter;