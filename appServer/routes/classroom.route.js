
const express = require('express');
const classroomController = require('../controllers/classroom.controller');
const classroomRouter = express.Router();
const PostController = require('../controllers/post.controller');
const authorize = require('../middlewares/authorize.middleware');
const EnumServerDefinitions = require('../common/enums/enum_server_definitions');
const checkRoomMember = require('../middlewares/check_room_member.middleware');


classroomRouter.get('/', authorize([EnumServerDefinitions.ROLE.TEACHER, EnumServerDefinitions.ROLE.STUDENT]), classroomController.showJoinedClassrooms);
classroomRouter.get('/init', authorize([EnumServerDefinitions.ROLE.TEACHER]), classroomController.getSubjectAndRegularClass);
classroomRouter.get('/:classroom_id',  authorize([EnumServerDefinitions.ROLE.TEACHER, EnumServerDefinitions.ROLE.STUDENT]), checkRoomMember, PostController.showPostsByUser);
//classroomRouter.post('/create-classroom', authorize([EnumServerDefinitions.ROLE.TEACHER]), classroomController.createClassroom);
//classroomRouter.post('/join-classroom', classroomController.joinClassroom);

module.exports = classroomRouter;