const express = require('express');
const PostController = require('../../controllers/post.controller');
const checkRoomMember = require('../../middlewares/check_room_member.middleware');
const { download } = require('../../middlewares/upload_and_download_file.middleware');
const checkPostBelongToClassroom = require('../../middlewares/check_post_classroom.middleware');

const postRouter = express.Router();

postRouter.post('/create-post', download.array('files'), checkRoomMember, PostController.createPost);
postRouter.get('/:post_id/post-detail', checkPostBelongToClassroom, PostController.getPostDetail);

module.exports = postRouter;