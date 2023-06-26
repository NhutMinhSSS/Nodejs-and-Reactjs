const express = require('express');
const SubjectRouter = express.Router();
const SubjectController = require('../../controllers/subject.controller'); 

SubjectRouter.get('/', SubjectController.getAllSubjects);

module.exports = SubjectRouter;