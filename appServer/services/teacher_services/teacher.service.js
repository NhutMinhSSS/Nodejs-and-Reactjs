const Teacher = require('../../models/teacher.model');
const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const TeacherList = require("../../models/teacher_list.model");
const Department = require("../../models/department.model");
const { Op } = require("sequelize");
const Classroom = require('../../models/classroom.model');
const RegularClass = require('../../models/regular_class.model');
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
    async findTeacherById(id) {
        try {
            const teacher = await Teacher.findOne({
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id', 'teacher_code', 'first_name', 'last_name', 'department_id']
            });
            return teacher;
        } catch (error) {
            throw error;
        }
    }
    async findTeacherByDepartmentId(teacherId, departmentId) {
        try {
            const teacher = await Teacher.findOne({
                where: {
                    id: teacherId,
                    department_id: departmentId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id']
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
    async findAllTeachers() {
        try {
            const teachers = await Teacher.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id', 'first_name', 'last_name', 'department_id']
            });
            return teachers;
        } catch (error) {
            throw error;
        }
    }
    async findAllTeachersAndDepartment() {
        try {
            const teachers = await Teacher.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: [{
                    model: Department,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['department_name']
                }],
                attributes: ['id', 'teacher_code', 'first_name', 'last_name', 'date_of_birth', 'gender', 'phone_number', 'CCCD', 'address'],
                order: [['teacher_code', 'ASC']]
            });
            return teachers;
        } catch (error) {
            throw error;
        }
    }
    async findTeachersNotInClassroom(classroomId) {
        try {
            const teachersNotInClassroom = await Teacher.findAll({
                include: [{
                    model: Department,
                    required: true,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    include: [{
                        model: RegularClass,
                        required: true,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        include: [{
                            model: Classroom,
                            where: {
                                id: classroomId,
                                status: { [Op.in]: [EnumServerDefinitions.STATUS.ACTIVE, EnumServerDefinitions.STATUS.CLOSE] }
                            },
                            attributes: []
                        }],
                        attributes: []
                    }],
                    attributes: ['department_name']
                }],
                where: {
                    id: {
                        [Op.notIn]: Teacher.sequelize.literal(
                            `(SELECT teacher_id FROM teacher_lists WHERE classroom_id = ${classroomId} AND status = ${EnumServerDefinitions.STATUS.ACTIVE})`
                        )
                    },
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id', 'first_name', 'last_name']
            });
            return teachersNotInClassroom;
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
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return !!newTeacher;
        } catch (error) {
            throw error;
        }
    }
    async activeTeacher(id, transaction) {
        try {
            const isActive = await Teacher.update({
                status: EnumServerDefinitions.STATUS.ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.NO_ACTIVE
                }, transaction
            });
            return isActive > EnumServerDefinitions.EMPTY;
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
            const isDelete = await Teacher.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            return isDelete > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TeacherService;