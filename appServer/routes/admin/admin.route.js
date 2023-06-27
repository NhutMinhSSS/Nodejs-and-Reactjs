const express = require('express');
const AdminRouter = express.Router();
const authorize = require('../../middlewares/authorize.middleware');
const EnumServerDefinitions = require('../../common/enums/enum_server_definitions');
const FacultyAdminRouter = require('./faculty.admin.route');
const DepartmentAdminRouter = require('./department.admin.route');
const SubjectAdminRouter = require('./subject.admin.route');
const RegularClassAdminRouter = require('./regular_class.admin.route');
const TeacherAdminRouter = require('./teacher.admin.route');

AdminRouter.use(authorize([EnumServerDefinitions.ROLE.ADMIN]));
AdminRouter.use('/faculties', FacultyAdminRouter);
AdminRouter.use('/departments', DepartmentAdminRouter);
AdminRouter.use('/subjects', SubjectAdminRouter);
AdminRouter.use('/regular-class', RegularClassAdminRouter);
AdminRouter.use('/teachers', TeacherAdminRouter);


module.exports = AdminRouter;