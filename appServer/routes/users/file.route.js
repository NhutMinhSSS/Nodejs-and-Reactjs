
const express = require('express');
const FileController = require('../../controllers/file.controller');
const checkPostBelongToClassroom = require('../../middlewares/check_post_classroom.middleware');
const FileRouter = express.Router();

FileRouter.get('/:file_id', checkPostBelongToClassroom, FileController.sendFileToClient);

module.exports = FileRouter;