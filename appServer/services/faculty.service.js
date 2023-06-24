const EnumServerDefinitions = require('../common/enums/enum_server_definitions');
const Classroom = require('../models/classroom.model');
const Department = require('../models/department.model');
const Faculty = require('../models/faculty.model');
const RegularClass = require('../models/regular_class.model');
const Subject = require("../models/subject.model");

class FacultyService {
    async findFacultyByName(facultyName) {
        try {
            const faculty = await Faculty.findOne({
                where: {
                    faculty_name: facultyName,
                }
            });
            return faculty;
        } catch (error) {
            throw error;
        }
    }
    async findAllFaculty() {
        try {
            const faculty = await Faculty.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return faculty;
        } catch (error) {
            throw error;
        }
    }
    async updateFaculty(id, facultyName) {
        try {
            const faculty =  await Faculty.update({
                faculty_name: facultyName
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return !!faculty;
        } catch (error) {
            throw error;
        }
    }
    async deleteFaculty(id, transaction) {
        try {
                const subjects = await Subject.findAll({
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['id'],
                    include: [
                        {
                            model: Department,
                            attributes: [],
                            where: {
                                faculty_id: id,
                                status: EnumServerDefinitions.STATUS.ACTIVE
                            }
                        }
                    ]
                });
                const subjectIds = subjects.map((subject) => subject.id);
                const departmentIds = subjects.map((item) => item.Department.id);
                await Department.update(
                    { status: EnumServerDefinitions.STATUS.NO_ACTIVE },
                    { where: { id: departmentIds, status: EnumServerDefinitions.STATUS.ACTIVE }, transaction, fields: ['status'] }
                );
                await RegularClass.update({
                    status: EnumServerDefinitions.STATUS.NO_ACTIVE
                }, { where: { department_id: departmentIds, status: EnumServerDefinitions.STATUS.ACTIVE }, transaction, fields: ['status'] });
                await Subject.update(
                    { status: EnumServerDefinitions.STATUS.NO_ACTIVE },
                    { where: { id: subjectIds, status: EnumServerDefinitions.STATUS.ACTIVE }, transaction, fields: ['status'] }
                );
                await Classroom.update(
                    { status: EnumServerDefinitions.STATUS.NO_ACTIVE },
                    { where: { subject_id: subjectIds, status: EnumServerDefinitions.STATUS.ACTIVE }, transaction, fields: ['status'] }
                );
                const faculty =  await Faculty.update({
                    status: EnumServerDefinitions.STATUS.NO_ACTIVE
                }, {
                    where: {
                        id: id,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    }
                });
                return !!faculty;
        } catch (error) {
            throw error;
        }
    }
    async activeFaculty(id, transaction) {
        try {
            const faculty = await Faculty.update({
                status: EnumServerDefinitions.STATUS.ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.NO_ACTIVE
                }, transaction
            });
            return !!faculty;
        } catch (error) {
            throw error;
        }
    }
    async addFaculty(facultyName) {
        try {
            const newFaculty = await Faculty.create({
                faculty_name: facultyName
            });
            return newFaculty;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new FacultyService;