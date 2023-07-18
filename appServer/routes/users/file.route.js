
const express = require('express');
const FileController = require('../../controllers/file.controller');
const checkPostBelongToClassroom = require('../../middlewares/check_post_classroom.middleware');
const FileRouter = express.Router();

FileRouter.get('/:post_id/:file_id/download', checkPostBelongToClassroom, FileController.sendFileToClient);
FileRouter.get('/stream/:file_id', FileController.showFileToClient);

module.exports = FileRouter;