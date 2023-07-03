
const express = require('express');
const ClassroomController = require('../../controllers/classroom.controller');
const ClassroomRouter = express.Router();
const PostController = require('../../controllers/post.controller');
const authorize = require('../../middlewares/authorize.middleware');
const EnumServerDefinitions = require('../../common/enums/enum_server_definitions');
const checkRoomMember = require('../../middlewares/check_room_member.middleware');


ClassroomRouter.get('/', authorize([EnumServerDefinitions.ROLE.TEACHER, EnumServerDefinitions.ROLE.STUDENT]), ClassroomController.showJoinedClassrooms);
ClassroomRouter.get('/get-posts/:classroom_id',  authorize([EnumServerDefinitions.ROLE.TEACHER, EnumServerDefinitions.ROLE.STUDENT]), checkRoomMember, PostController.showPostsByUser);
//classroomRouter.post('/create-classroom', authorize([EnumServerDefinitions.ROLE.TEACHER]), classroomController.createClassroom);
//classroomRouter.post('/join-classroom', classroomController.joinClassroom);
ClassroomRouter.patch('/:classroom_id/close-storage', authorize([EnumServerDefinitions.ROLE.ADMIN, EnumServerDefinitions.ROLE.TEACHER]), ClassroomController.StorageClassroom);
ClassroomRouter.get('/get-storage-classrooms', authorize([EnumServerDefinitions.ROLE.ADMIN, EnumServerDefinitions.ROLE.TEACHER]), ClassroomController.getAllStorageClassrooms);

module.exports = ClassroomRouter;