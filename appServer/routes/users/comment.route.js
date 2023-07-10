
const express = require('express');
const CommentController = require('../../controllers/comment.controller');
const authorize = require('../../middlewares/authorize.middleware');
const EnumServerDefinitions = require('../../common/enums/enum_server_definitions');
const checkPostBelongToClassroom = require('../../middlewares/check_post_classroom.middleware');

const CommentRouter  = express.Router();

CommentRouter.post('/create-comment', authorize([EnumServerDefinitions.ROLE.TEACHER, EnumServerDefinitions.ROLE.TEACHER]), checkPostBelongToClassroom, CommentController.createComment);