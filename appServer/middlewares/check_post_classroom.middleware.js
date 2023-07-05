const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const ServerResponse = require("../common/utils/server_response");
const logger = require("../config/logger.config");
const ClassroomStudentService = require("../services/classroom_services/classroom_student.service");
const ClassroomTeacherService = require("../services/classroom_services/classroom_teacher.service");
const PostService = require("../services/post_services/post.service");
const StudentService = require("../services/student_services/student.service");
const TeacherService = require("../services/teacher_services/teacher.service");


const checkPostBelongToClassroom = async(req, res, next) => {
    try {
        const accountId = req.user.account_id;
        const role = req.user.role;
        const postId = req.params.post_id || req.body.post_id;
        const post = await PostService.checkPostBelongTo(postId);
        if (!post) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                EnumMessage.POST_NOT_EXISTS);
        }
        let user;
       if (role === EnumServerDefinitions.ROLE.TEACHER) {
            const teacher = await TeacherService.findTeacherByAccountId(accountId);
            user = await ClassroomTeacherService.isTeacherJoined(post.classroom_id, teacher.id);
       } else {
            const student = await StudentService.findStudentByAccountId(accountId);
            user = await ClassroomStudentService.isStudentJoined(post.classroom_id, student.id);
            req.student_id = student.id;
            req.post = {
                post_id:  post.id,
                post_category_id: post.post_category_id
            };
       }
       if (!user) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST,
                EnumMessage.NO_PERMISSION);
       }
       next();
    } catch (error) {
        logger.error(error);
        return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
            EnumMessage.DEFAULT_ERROR);
    }
}

module.exports = checkPostBelongToClassroom;