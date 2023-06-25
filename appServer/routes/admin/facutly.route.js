
const express = require('express');
const FacultyRouter = express.Router();
const FacultyController = require('../../controllers/faculty.controller');

FacultyRouter.get('/', FacultyController.getAllFaculties);

module.exports = FacultyRouter;