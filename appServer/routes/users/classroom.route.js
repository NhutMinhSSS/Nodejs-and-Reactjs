
const express = require('express');
const ClassroomController = require('../../controllers/classroom.controller');
const ClassroomRouter = express.Router();
const PostController = require('../../controllers/post.controller');
const authorize = require('../../middlewares/authorize.middleware');
const EnumServerDefinitions = require('../../common/enums/enum_server_definitions');
const checkRoomMember = require('../../middlewares/check_room_member.middleware');


ClassroomRouter.get('/', authorize([EnumServerDefinitions.ROLE.TEACHER, EnumServerDefinitions.ROLE.STUDENT]), ClassroomController.showJoinedClassrooms);
ClassroomRouter.get('/get-classroom-detail/:classroom_id', ClassroomController.getListTeachersAndListStudentsByClassroomId);
ClassroomRouter.get('/get-posts/:classroom_id',  authorize([EnumServerDefinitions.ROLE.TEACHER, EnumServerDefinitions.ROLE.STUDENT]), checkRoomMember, PostController.showPostsByUser);
//classroomRouter.post('/create-classroom', authorize([EnumServerDefinitions.ROLE.TEACHER]), classroomController.createClassroom);
//classroomRouter.post('/join-classroom', classroomController.joinClassroom);
ClassroomRouter.patch('/:classroom_id/close-storage', authorize([EnumServerDefinitions.ROLE.ADMIN, EnumServerDefinitions.ROLE.TEACHER]), ClassroomController.closeStorageClassroom);
ClassroomRouter.patch('/:classroom_id/open-storage', authorize([EnumServerDefinitions.ROLE.ADMIN, EnumServerDefinitions.ROLE.TEACHER]), ClassroomController.openStorageClassroom);
ClassroomRouter.get('/get-storage-classrooms', authorize([EnumServerDefinitions.ROLE.ADMIN, EnumServerDefinitions.ROLE.TEACHER]), ClassroomController.getAllStorageClassrooms);

module.exports = ClassroomRouter;