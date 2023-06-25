const express = require('express');
const AdminRouter = express.Router();
const authorize = require('../middlewares/authorize.middleware');
const EnumServerDefinitions = require('../common/enums/enum_server_definitions');
const FacultyRouter = require('./facutly.route');

AdminRouter.use(authorize([EnumServerDefinitions.ROLE.ADMIN]));
AdminRouter.use('faculties', FacultyRouter);
AdminRouter

module.exports = AdminRouter;