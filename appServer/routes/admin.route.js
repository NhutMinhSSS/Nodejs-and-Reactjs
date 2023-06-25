
const express = require('express');
const AdminRouter = express.Router();
const authorize = require('../middlewares/authorize.middleware');
const EnumServerDefinitions = require('../common/enums/enum_server_definitions');
const FacultyController = require('../controllers/faculty.controller');

AdminRouter.use(authorize([EnumServerDefinitions.ROLE.ADMIN]));
AdminRouter.get('/faculty', FacultyController.getAllFaculties);

module.exports = AdminRouter;