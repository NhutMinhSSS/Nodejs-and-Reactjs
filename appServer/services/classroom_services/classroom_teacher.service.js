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
    // async isTeacherJoined(classroomId, teacherId) {
    //     try {
    //     const isJoined = await TeacherList.findOne({
    //         classroom_id: classroomId,
    //         teacher_id: teacherId,
    //         status: EnumServerDefinitions.STATUS.ACTIVE
    //     });
    //     return !!isJoined; 
    //     } catch(error) {
    //         throw error;
    //     }
    // }
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
            const newTeacher = await TeacherList.create({
                classroom_id: classroomId,
                teacher_id: teacherId
            }, { transaction });
            return newTeacher;
        } catch(error) {
            throw error;
        }
    }
    async addTeachersToClassroom(teacherIds, classroomId, transaction) {
        try {
            const listTeachers = teacherIds.map(item => ({
                classroom_id: classroomId,
                teacher_id: item
            }));
            const newListTeachers = await TeacherList.bulkCreate(listTeachers, { updateOnDuplicate: ['teacher_id', 'classroom_id'], transaction });
            return newListTeachers;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new ClassroomTeacherService;