const TeacherList = require('../models/teacher_list.model')
class ClassroomTeacherService {
    async addTeacherToClassroom(classroomId, teacherId, transaction) {
        try{
            const newTeacherToClassroom = await TeacherList.create({
                classroom_id: classroomId,
                teacher_id: teacherId
            }, { transaction: transaction});
            return newTeacherToClassroom;
        } catch(error) {
            throw error;
        }
    }
}
module.exports = new ClassroomTeacherService;