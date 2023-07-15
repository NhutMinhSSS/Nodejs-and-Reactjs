const express = require('express');
const PostController = require('../../controllers/post.controller');
const checkRoomMember = require('../../middlewares/check_room_member.middleware');
const { download } = require('../../middlewares/upload_and_download_file.middleware');
const checkPostBelongToClassroom = require('../../middlewares/check_post_classroom.middleware');
const StudentController = require('../../controllers/student.controller');
const authorize = require('../../middlewares/authorize.middleware');
const EnumServerDefinitions = require('../../common/enums/enum_server_definitions');
const PostRouter = express.Router();

PostRouter.get('/:classroom_id/get-list-student-classroom', StudentController.getStudentsByClassroomId);
PostRouter.post('/create-post', authorize([EnumServerDefinitions.ROLE.STUDENT, EnumServerDefinitions.ROLE.TEACHER]), download.array('files'), checkRoomMember, PostController.createPost);
PostRouter.get('/:post_id/post-detail', authorize([EnumServerDefinitions.ROLE.STUDENT, EnumServerDefinitions.ROLE.TEACHER]), checkPostBelongToClassroom, PostController.getPostDetail);
PostRouter.delete('/:post_id/delete-post', authorize([EnumServerDefinitions.ROLE.STUDENT, EnumServerDefinitions.ROLE.TEACHER]), PostController.deletePost);

module.exports = PostRouter;