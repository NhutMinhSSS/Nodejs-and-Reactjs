const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
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
    async findAllStudent() {
        try {
            const students = await Student.findAll({
                status: EnumServerDefinitions.STATUS.ACTIVE
            });
            return students;
        } catch (error) {
            throw error;
        }
    }
    async updateStudent(id, firstName, lastName, dateOfBirth, gender, phoneNumber, regularClassId, address) {
        try {
            const isUpdate = await Student.update({
                first_name: firstName,
                last_name: lastName,
                date_of_birth: dateOfBirth,
                gender: gender,
                phone_number: phoneNumber,
                regular_class_id: regularClassId,
                address: address
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return !!isUpdate;
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
            return !!isDelete;
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
    async findAllStudents() {
        try {
            const students = await Student.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                order: ['student_code', 'ASC']
            });
            return students;
        } catch (error) {
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