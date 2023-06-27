const express = require('express');
const SubjectRouter = express.Router();
const SubjectController = require('../../controllers/subject.controller'); 

SubjectRouter.get('/', SubjectController.getAllSubjectsInit);
SubjectRouter.get('/get-subjects', SubjectController.getListSubjects);
SubjectRouter.post('/create-subject', SubjectController.addSubject);
SubjectRouter.patch('/update-subject', SubjectController.updateSubject);
SubjectRouter.delete('/delete-subjects/:subject_id', SubjectController.deleteSubject);

module.exports = SubjectRouter;