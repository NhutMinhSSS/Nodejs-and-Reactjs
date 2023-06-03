const { STATUS } = require("../common/enums/enum_server_definitions");
const Student = require("../models/student.model");


class StudentService {
    async findStudentById(id) {
        try {
            const student = await Student.findOne({
                where: {
                    id: id,
                    status: STATUS
                }
            });
            return student;
        } catch (error) {
            throw error;
        }
    }
    async addStudent(studentCode, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, accountId, address) {
        const transaction = await Student.sequelize.transaction();
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
                address: address
            }, { transaction });
            await transaction.commit();
            return newStudent;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}