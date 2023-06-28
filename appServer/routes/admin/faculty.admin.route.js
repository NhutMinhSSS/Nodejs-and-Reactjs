
const express = require('express');
const FacultyAdminRouter = express.Router();
const FacultyController = require('../../controllers/faculty.controller');

FacultyAdminRouter.get('/', FacultyController.getAllFacultiesInit);
FacultyAdminRouter.get('/get-faculties', FacultyController.getListFaculties);
FacultyAdminRouter.post('/create-faculty', FacultyController.addFaculty);
FacultyAdminRouter.patch('/update-faculty', FacultyController.updateFaculty);
FacultyAdminRouter.delete('/delete-faculty/:faculty_id', FacultyController.deleteFaculty);

module.exports = FacultyAdminRouter;