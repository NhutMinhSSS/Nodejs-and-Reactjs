const express = require('express');
const DepartmentRouter = express.Router();
const DepartmentController = require('../controllers/department.controller'); 

DepartmentRouter.get('/', DepartmentController.getAllDepartments);

module.exports = DepartmentRouter;