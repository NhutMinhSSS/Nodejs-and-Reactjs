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
    async findStudentsByClassroomId(classroomId) {
        try {
            const listStudents = await StudentList.findAll({
                where: {
                    classroom_id: classroomId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return listStudents;
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
    async checkStudentNoActive(classroomId, studentId) {
        try {
            const student = await StudentList.findOne({
               where: {
                classroom_id: classroomId,
                student_id: studentId,
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
               }
            });
            return student; 
            } catch(error) {
                throw error;
            }
    }
    async addStudentsToNewClassroom(classroomId, studentIds, transaction) {
        try {
            const listStudent = studentIds.map(item => ({
                classroom_id: classroomId,
                student_id: item
            }));
            const newStudentsToClassroom = await StudentList.bulkCreate(listStudent, { transaction});
            return newStudentsToClassroom;
        } catch (error) {
            throw error;
        }
    }
    async addStudentToClassroom(classroomId, studentId, transaction) {
        try {
            const studentExistsClassroom = await this.checkStudentNoActive(classroomId, studentId);
            if (studentExistsClassroom) {
                await StudentList.update({
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, {
                    where: {
                       id: studentExistsClassroom.id
                    }, transaction: transaction
                });
                return studentExistsClassroom;
            } else {
                const newStudentToClassroom = await StudentList.create({
                    classroom_id: classroomId,
                    student_id: studentId
                }, { transaction: transaction});
                return newStudentToClassroom;
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ClassroomStudentService;