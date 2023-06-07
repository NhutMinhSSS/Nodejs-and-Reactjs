const TeacherList = require('../../models/teacher_list.model');
const EnumServerDefinitions = require('../enums/enum_server_definitions');
const StudentList = require('../../models/student_list.model');
const ClassroomService = require('../../services/classroom_services/classroom.service');
const EnumMessage = require('../enums/enum_message');
const TeacherService = require('../../services/teacher_services/teacher.service');
const StudentService = require('../../services/student_services/student.service');

class CommonService {
    //function find list classroom form student id or teacher id with condition role
    async findClassroomsByUser(userId, userRole) {
        try {
            let listClassroomUser;
            const classroomId = 'classroom_id';
            if (userRole === EnumServerDefinitions.ROLE.TEACHER) {
                listClassroomUser = await TeacherList.findAll({
                    where: {
                        teacher_id: userId,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: [classroomId]
                });
            } else if (userRole === EnumServerDefinitions.ROLE.STUDENT) {
                listClassroomUser = await StudentList.findAll({
                    where: {
                        student_id: userId,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: [classroomId]
                });
            } else {
                throw new Error(EnumMessage.ROLE_INVALID);
            }
            const classroomIds = listClassroomUser.map((item) => item[classroomId]);
            const classrooms = await ClassroomService.findAllClassroomsByIds(classroomIds);
            return classrooms;
        } catch (error) {
            throw error;
        }
    }
    async findUsersByClassroomId(classroomId, userRole) {
        try {
            const userType = userRole === EnumServerDefinitions.ROLE.TEACHER ? 'teacher_id' : 'student_id';
            const listClassroomUser = await (userRole === EnumServerDefinitions.ROLE.TEACHER ? TeacherList : StudentList).findAll({
                where: {
                    classroom_id: classroomId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: [userType]
            });
            const userIds = listClassroomUser.map((item) => item[userType]);
            const users = await (userRole === EnumServerDefinitions.ROLE.TEACHER ? TeacherService : StudentService).findAllUsersByIds(userIds);
            return users;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CommonService;