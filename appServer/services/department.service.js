const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const Classroom = require("../models/classroom.model");
const Department = require("../models/department.model");
const Faculty = require("../models/faculty.model");
const RegularClass = require("../models/regular_class.model");
const Subject = require("../models/subject.model");


class DepartmentService {
    async findDepartmentByName(departmentName) {
        try {
            const department = await Department.findOne({
                where: {
                    department_name: departmentName
                }
            });
            return department;
        } catch (error) {
            throw error;
        }
    }
    async findAllDepartment(countSubject = false) {
        try {
            const department = await Department.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: [countSubject ? {
                    model: Subject,
                    required: false,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: []
                } : [], {
                    model: Faculty,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['faculty_name']
                }],
                attributes: ['id', 'faculty_name',
                    countSubject ? [Department.sequelize.literal(`(SELECT COUNT(*) FROM subjects WHERE subjects.department_id = Department.id and subjects.status = ${EnumServerDefinitions.STATUS.ACTIVE})`),
                        'subject_quantity'] : []],
                order: [
                    ['created_at', 'ASC'],
                    ['updated_at', 'ASC']
                ]
            });
            return department;
        } catch (error) {
            throw error;
        }
    }
    async updateDepartment(id, departmentName, facultyId) {
        try {
            const department = await Department.update({
                department_name: departmentName,
                faculty_id: facultyId
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return !!department;
        } catch (error) {
            throw error;
        }
    }
    async deleteDepartment(id, transaction) {
        try {
            const subjects = await Subject.findAll({
                where: {
                    department_id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            const subjectIds = subjects.map((item) => item.id);
            await Subject.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    department_id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            await Classroom.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    subject_id: subjectIds,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            await RegularClass.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    department_id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            const department = await Department.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            return !!department;
        } catch (error) {
            throw error;
        }
    }
    async activeDepartment(id, facultyId) {
        try {
            const department = await Department.update({
                faculty_id: facultyId,
                status: EnumServerDefinitions.STATUS.ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.NO_ACTIVE
                }
            });
            return !!department;
        } catch (error) {
            throw error;
        }
    }
    async checkDepartmentExist(id) {
        try {
            const isCheck = await Department.findOne({
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id']
            });
            return !!isCheck;
        } catch (error) {
            throw error;
        }
    }
    async addDepartment(departmentName, facultyId) {
        try {
            const newDepartment = Department.create({
                department_name: departmentName,
                faculty_id: facultyId
            });
            return newDepartment;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DepartmentService;