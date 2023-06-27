const express = require('express');
const DepartmentAdminRouter = express.Router();
const DepartmentController = require('../../controllers/department.controller'); 

DepartmentAdminRouter.get('/', DepartmentController.getAllDepartmentsInit);
DepartmentAdminRouter.get('/get-departments', DepartmentController.getListDepartments);
DepartmentAdminRouter.post('/create-department', DepartmentController.addDepartment);
DepartmentAdminRouter.patch('/update-department', DepartmentController.updateDepartment);
DepartmentAdminRouter.delete('/delete-department/:department_id', DepartmentController.deleteDepartment);

module.exports = DepartmentAdminRouter;