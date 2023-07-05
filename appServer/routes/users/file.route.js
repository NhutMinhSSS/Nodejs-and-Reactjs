
const express = require('express');
const FileController = require('../../controllers/file.controller');
const FileRouter = express.Router();

FileRouter.get('/:file_id', FileController.sendFileToClient);

module.exports = FileRouter;