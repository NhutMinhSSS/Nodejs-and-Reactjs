const { Op } = require("sequelize");
const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const Classroom = require("../../models/classroom.model");
const RegularClass = require("../../models/regular_class.model");
const Student = require("../../models/student.model");
const StudentList = require("../../models/student_list.model"); 

class StudentService {
    async findStudentByStudentCode(studentCode) {
        try {
            const student = await Student.findOne({
                where: {
                    student_code: studentCode
                }
            });
            return student;
        } catch (error) {
            throw error
        }
    }
    async findStudentById(id) {
        try {
            const student = await Student.findOne({
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return student;
        } catch (error) {
            throw error;
        }
    }
    async findAllStudents() {
        try {
            const students = await Student.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: [{
                    model: RegularClass,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['class_name']
                }],
                attributes: ['id', 'student_code', 'first_name', 'last_name']
            });
            return students;
        } catch (error) {
            throw error;
        }
    }
    async findStudentsByRegularClass(regularClassId) {
        try {
            const students = await Student.findAll({
                where: {
                    regular_class_id: regularClassId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id']
            });
            return students;
        } catch (error) {
            throw error;
        }
    }
    async findStudentNotInClassroom(classroomId, regularClassId) {
        try {
            const listStudentsNotInClassroom = await Student.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE,
                    regular_class_id: regularClassId,
                    id: {
                        [Op.notIn]: Student.sequelize.literal(`(SELECT student_id FROM student_lists WHERE classroom_id = ${classroomId} AND status = ${EnumServerDefinitions.STATUS.ACTIVE})`),
                      },
                },
                include: [
                    {
                      model: RegularClass,
                      where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                      },
                      attributes: ['class_name']
                    }
                  ],
                attributes: ['id', 'first_name', 'last_name'],
            });
            return listStudentsNotInClassroom;
        } catch (error) {
            throw error;
        }
    }
    // async checkCCDDExist(CCCD) {
    //     try {
    //         const isCheck = await CommonService.checkCCCDUserExist(CCCD, EnumServerDefinitions.ROLE.STUDENT);
    //         return isCheck;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    async updateStudent(id, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, regularClassId, address) {
        try {
            const isUpdate = await Student.update({
                first_name: firstName,
                last_name: lastName,
                date_of_birth: dateOfBirth,
                gender: gender,
                phone_number: phoneNumber,
                CCCD: CCCD,
                regular_class_id: regularClassId,
                address: address
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return isUpdate > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
    async deleteStudent(id, transaction) {
        try {
            await StudentList.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    student_id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            const isDelete =  await Student.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: id
                }, transaction
            });
            return isDelete > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
    async findStudentByAccountId(accountId) {
        try {
            const student = await Student.findOne({
                where: {
                    account_id: accountId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return student;
        } catch(error) {
            throw error;
        }
    }
    async activeStudent(id, transaction) {
        try {
            const student = await Student.update({
                status: EnumServerDefinitions.STATUS.ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.NO_ACTIVE
                }, transaction
            });
            return !!student;
        } catch (error) {
            throw error;
        }
    }
    async addStudent(studentCode, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, accountId, regularClassId, address, transaction) {
        try {
            const newStudent = await Student.create({
                student_code: studentCode,
                first_name: firstName,
                last_name: lastName,
                date_of_birth: dateOfBirth,
                gender: gender,
                phone_number: phoneNumber,
                CCCD: CCCD,
                account_id: accountId,
                regular_class_id: regularClassId,
                address: address
            }, { transaction: transaction});
            return newStudent;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StudentService;