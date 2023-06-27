const express = require('express');
const RegularClassRouter = express.Router();
const RegularClassController = require('../../controllers/regular_class.controller');

RegularClassRouter.get('/', RegularClassController.getAllRegularClassInit);
RegularClassRouter.get('/get-regular-class', RegularClassController.getListRegularClass);
RegularClassRouter.post('/create-regular-class', RegularClassController.createRegularClass);
RegularClassRouter.patch('/update-regular-class', RegularClassController.updateRegularClass);
RegularClassRouter.delete('/delete-regular-class/:regular_class_id', RegularClassController.deleteRegularClass);

module.exports = RegularClassRouter;