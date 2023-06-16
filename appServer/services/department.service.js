const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const Classroom = require("../models/classroom.model");
const Department = require("../models/department.model");
const RegularClass = require("../models/regular_class.model");
const Subject = require("../models/subject.model");


class DepartmentService {
    async findAllDepartment() {
        try {
            const department = await Department.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
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
            return department > 0;
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
            return department > 0;
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