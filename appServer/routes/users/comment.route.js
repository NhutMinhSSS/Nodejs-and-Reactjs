
const express = require('express');
const CommentController = require('../../controllers/comment.controller');
const authorize = require('../../middlewares/authorize.middleware');
const EnumServerDefinitions = require('../../common/enums/enum_server_definitions');
const checkPostBelongToClassroom = require('../../middlewares/check_post_classroom.middleware');

const CommentRouter  = express.Router();

CommentRouter.post('/create-comment', authorize([EnumServerDefinitions.ROLE.TEACHER, EnumServerDefinitions.ROLE.STUDENT]), checkPostBelongToClassroom, CommentController.createComment);
CommentRouter.patch('/:comment_id/delete-comment', authorize([EnumServerDefinitions.ROLE.STUDENT, EnumServerDefinitions.ROLE.TEACHER]), CommentController.deleteComment);

module.exports = CommentRouter;