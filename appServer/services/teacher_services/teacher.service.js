const Teacher = require('../../models/teacher.model');
const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const TeacherList = require("../../models/teacher_list.model");
class TeacherService {
    async findTeacherByTeacherCode(teacherCode) {
        try {
            const teacher = await Teacher.findOne({
                where: {
                    teacher_code: teacherCode
                }
            });
            return teacher;
        } catch (error) {
            throw error;
        }
    }
    async findTeacherByAccountId(accountId) {
        try {
            const teacher = await Teacher.findOne({
                where: {
                    account_id: accountId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return teacher;
        } catch (error) {
            throw error;
        }
    }
    async findAllTeacher() {
        try {
            const teachers = await Teacher.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                order: ['teacher_code', 'ASC']
            });
            return teachers;
        } catch (error) {
            throw error;
        }
    }
    async checkTeacherByDepartmentId(teacherId, departmentId) {
        try {
            const isTeacher = await Teacher.findOne({
                where: {
                    id: teacherId,
                    department_id: departmentId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
            });
            return !!isTeacher;
        } catch (error) {
            throw error;
        }
    }
    async addTeacher(teacherCode, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, accountId, departmentId, address, transaction) {
        try {
            const newTeacher = await Teacher.create({
                teacher_code: teacherCode,
                first_name: firstName,
                last_name: lastName,
                date_of_birth: dateOfBirth,
                gender: gender,
                phone_number: phoneNumber,
                CCCD: CCCD,
                account_id: accountId,
                department_id: departmentId,
                address: address
            }, { transaction });
            return newTeacher;
        } catch (error) {
            throw error;
        }
    }
    async updateTeacher(id, firstName, lastName, dateOfBirth, gender, phoneNumber, CCCD, departmentId, address) {
        try {
            const newTeacher = await Teacher.update({
                first_name: firstName,
                last_name: lastName,
                date_of_birth: dateOfBirth,
                gender: gender,
                phone_number: phoneNumber,
                CCCD: CCCD,
                department_id: departmentId,
                address: address
            }, { where: {
                id: id,
                status: EnumServerDefinitions.STATUS.ACTIVE
            }});
            return !!newTeacher;
        } catch (error) {
            throw error;
        }
    }
    async activeTeacher(id, transaction) {
        try  {
            const teacher = await Teacher.update({
                status: EnumServerDefinitions.STATUS.ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.NO_ACTIVE
                }, transaction
            });
            return !!teacher;
        } catch (error) {
            throw error;
        }
    }
    async deleteTeacher(id, transaction) {
        try {
            await TeacherList.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    teacher_id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            return await Teacher.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TeacherService;