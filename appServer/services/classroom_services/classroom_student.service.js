const EnumServerDefinitions = require('../../common/enums/enum_server_definitions');
const CommonService = require('../../common/utils/common_service');
const StudentList = require('../../models/student_list.model');

class ClassroomStudentService {
    async findClassroomsByStudentId(studentId) {
        try {
           const classrooms = await CommonService.findClassroomsByUser(studentId,EnumServerDefinitions.ROLE.STUDENT);
           return classrooms;
        } catch (error) {
            throw error;
        }    
    }
    async findStudentIdsByClassroomId(classroomId) {
        try {
            const students = await CommonService.findUsersByClassroomId(classroomId, EnumServerDefinitions.ROLE.STUDENT);
            return students;
        } catch (error) {
            throw error;
        }
    }
    async isStudentJoined(classroomId, studentId) {
        try {
        const isJoined = await StudentList.findOne({
            classroom_id: classroomId,
            student_id: studentId,
            status: EnumServerDefinitions.STATUS.ACTIVE
        });
        return !!isJoined; 
        } catch(error) {
            throw error;
        }
    }
    async addStudentToClassroom(classroomId, studentId, transaction) {
        try {
            const newStudentToClassroom = await StudentList.create({
                classroom_id: classroomId,
                student_id: studentId
            }, { transaction: transaction});
            return newStudentToClassroom;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ClassroomStudentService;