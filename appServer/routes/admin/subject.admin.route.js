const express = require('express');
const SubjectAdminRouter = express.Router();
const SubjectController = require('../../controllers/subject.controller'); 

SubjectAdminRouter.get('/', SubjectController.getAllSubjectsInit);
// SubjectAdminRouter.get('/get-subjects', SubjectController.getListSubjects);
// SubjectAdminRouter.post('/create-subject', SubjectController.addSubject);
// SubjectAdminRouter.patch('/update-subject', SubjectController.updateSubject);
// SubjectAdminRouter.delete('/delete-subjects/:subject_id', SubjectController.deleteSubject);

module.exports = SubjectAdminRouter;