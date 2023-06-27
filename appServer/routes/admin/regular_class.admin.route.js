const express = require('express');
const RegularClassAdminRouter = express.Router();
const RegularClassController = require('../../controllers/regular_class.controller');

RegularClassAdminRouter.get('/', RegularClassController.getAllRegularClassInit);
RegularClassAdminRouter.get('/get-regular-class', RegularClassController.getListRegularClass);
RegularClassAdminRouter.post('/create-regular-class', RegularClassController.createRegularClass);
RegularClassAdminRouter.patch('/update-regular-class', RegularClassController.updateRegularClass);
RegularClassAdminRouter.delete('/delete-regular-class/:regular_class_id', RegularClassController.deleteRegularClass);

module.exports = RegularClassAdminRouter;