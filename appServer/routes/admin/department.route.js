const express = require('express');
const DepartmentRouter = express.Router();
const DepartmentController = require('../../controllers/department.controller'); 

DepartmentRouter.get('/', DepartmentController.getAllDepartmentsInit);
DepartmentRouter.get('/get-departments', DepartmentController.getListDepartments);
DepartmentRouter.post('/create-department', DepartmentController.addDepartment);
DepartmentRouter.patch('/update-department', DepartmentController.updateDepartment);
DepartmentRouter.delete('/delete-department/:department_id', DepartmentController.deleteDepartment);

module.exports = DepartmentRouter;