const EnumServerDefinitions = require('../../common/enums/enum_server_definitions');
const CommonService = require('../../common/utils/common_service');
const TeacherList = require('../../models/teacher_list.model');

class ClassroomTeacherService {
    //Function find list classroom form teacher id
    async findClassroomsByTeacherId(teacherId) {
        try {
            const classrooms = await CommonService.findClassroomsByUser(teacherId, EnumServerDefinitions.ROLE.TEACHER);
            return classrooms;
        } catch (error) {
            throw error;
        }
    }
    async isTeacherJoined(classroomId, teacherId) {
        try {
        const isJoined = await TeacherList.findOne({
            classroom_id: classroomId,
            teacher_id: teacherId,
            status: EnumServerDefinitions.STATUS.ACTIVE
        });
        return !!isJoined; 
        } catch(error) {
            throw error;
        }
    }
    async checkTeacherNoActive(classroomId, teacherId) {
        try {
            const teacher = await TeacherList.findOne({
               where: {
                classroom_id: classroomId,
                teacher_id: teacherId,
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
               }
            });
            return teacher; 
            } catch(error) {
                throw error;
            }
    }
    async addTeacherToClassroom(classroomId, teacherId, transaction) {
        try{
            const teacherExistsClassroom = await this.checkTeacherNoActive(classroomId, teacherId);
            if (teacherExistsClassroom) {
                 await TeacherList.update({
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, { where: {
                    id: teacherExistsClassroom.id
                }, transaction: transaction});
                return teacherExistsClassroom;
            } else {
               const  newTeacherToClassroom = await TeacherList.create({
                    classroom_id: classroomId,
                    teacher_id: teacherId
                }, { transaction: transaction});
                return newTeacherToClassroom;
            } 
        } catch(error) {
            throw error;
        }
    }
}
module.exports = new ClassroomTeacherService;