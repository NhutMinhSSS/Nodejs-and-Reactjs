const { Op } = require('sequelize');
const EnumServerDefinitions = require('../../common/enums/enum_server_definitions');
const CommonService = require('../../common/utils/common_service');
const StudentList = require('../../models/student_list.model');
const Student = require('../../models/student.model');
const Classroom = require('../../models/classroom.model');

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
            const listStudents = await Classroom.findOne({
                where: {
                    id: classroomId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: [{
                    model: Student,
                    required: false,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['id', 'first_name', 'last_name'],
                    through: {
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                    }
                }],
                attributes: ['id'],
            });
            return listStudents.Students.map(item => ({
                student_id: item.id,
                first_name: item.first_name,
                last_name: item.last_name
            }));
        } catch (error) {
            throw error;
        }
    }
    async isStudentJoined(classroomId, studentId) {
        try {
        const isJoined = await StudentList.findOne({
            where: {
                classroom_id: classroomId,
            student_id: studentId,
            status: EnumServerDefinitions.STATUS.ACTIVE
            },
            attributes: ['id']
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
                student_id: item.id
            }));
            const newStudentsToClassroom = await StudentList.bulkCreate(listStudent, { transaction});
            return newStudentsToClassroom;
        } catch (error) {
            throw error;
        }
    }
    async addStudentsAlterToClassroom(classroomId, studentIds, transaction) {
        try {
            const existingStudentIds = await StudentList.findAll({
                where: {
                    classroom_id: classroomId,
                    student_id: {[Op.in]: studentIds}
                },
                attributes: ['student_id'],
                transaction
            });
            const studentsToUpdate = existingStudentIds.map(({ student_id}) => student_id);
            const studentsToInsert = studentIds.filter(studentId => !studentsToUpdate.includes(studentId));
            if (studentsToInsert.length !== EnumServerDefinitions.EMPTY) {
                const studentListInsert = studentsToInsert.map(studentId => ({
                    classroom_id: classroomId,
                    student_id: studentId,
                }));
                await StudentList.bulkCreate(studentListInsert, { transaction, updateOnDuplicate: ['status']});
            }
            if (studentsToUpdate.length !== EnumServerDefinitions.EMPTY) {
                await StudentList.update({status: EnumServerDefinitions.STATUS.ACTIVE}, {
                    where: {
                        classroom_id: classroomId,
                        student_id: {[Op.in]: studentsToUpdate}
                    }, transaction
                })
            }
            const result = {
                student_insert: studentsToInsert,
                student_update: studentsToUpdate 
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
    async removeStudentsFromClassroom(classroomId, studentIds) {
        try {
            const isRemove = await StudentList.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    classroom_id: classroomId,
                    student_id: {[Op.in]: studentIds},
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return isRemove > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ClassroomStudentService;