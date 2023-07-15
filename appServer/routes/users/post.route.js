const express = require('express');
const PostController = require('../../controllers/post.controller');
const checkRoomMember = require('../../middlewares/check_room_member.middleware');
const { download } = require('../../middlewares/upload_and_download_file.middleware');
const checkPostBelongToClassroom = require('../../middlewares/check_post_classroom.middleware');
const StudentController = require('../../controllers/student.controller');
const PostRouter = express.Router();

PostRouter.get('/:classroom_id/get-list-student-classroom', StudentController.getStudentsByClassroomId);
PostRouter.post('/create-post', download.array('files'), checkRoomMember, PostController.createPost);
PostRouter.get('/:post_id/post-detail', checkPostBelongToClassroom, PostController.getPostDetail);
PostRouter.delete('/:post_id/delete-post', PostController.deletePost);

module.exports = PostRouter;