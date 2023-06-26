const express = require('express');
const DepartmentRouter = express.Router();
const DepartmentController = require('../../controllers/department.controller'); 

DepartmentRouter.get('/', DepartmentController.getAllDepartments);
DepartmentRouter.get('/get-faculty', DepartmentController.getAllFaculty);
DepartmentRouter.post('/create-department', DepartmentController.addDepartment);
DepartmentRouter.patch('/update-department', DepartmentController.updateDepartment);
DepartmentRouter.delete('/delete-department/:department_id', DepartmentController.deleteDepartment);

module.exports = DepartmentRouter;