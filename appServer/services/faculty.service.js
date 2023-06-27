const EnumServerDefinitions = require('../common/enums/enum_server_definitions');
const FormatUtils = require('../common/utils/format.utils');
const Classroom = require('../models/classroom.model');
const Department = require('../models/department.model');
const Faculty = require('../models/faculty.model');
const RegularClass = require('../models/regular_class.model');
const Subject = require("../models/subject.model");
const { Op } = require('sequelize');
class FacultyService {
    async checkExistFacultyById(id) {
        try {
            const isExist = await Faculty.findOne({
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id']
            });
            return !!isExist;
        } catch (error) {
            throw error;
        }
    }
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
            const faculties = await Faculty.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id', 'faculty_name']
            });
            return faculties;
        } catch (error) {
            throw error
        }
    }
    async findAllFacultyAnDepartmentQuantity() {
        try {
            const faculty = await Faculty.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include:[
                    {
                        model: Department,
                        required: false,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: []
                    }
                ],
                attributes: [
                    'id',
                    'faculty_name',
                    [
                        Faculty.sequelize.literal(`(SELECT COUNT(*) FROM departments WHERE departments.faculty_id = Faculty.id and departments.status = ${EnumServerDefinitions.STATUS.ACTIVE})`),
                        'department_quantity'
                    ]
                ],
                order: [
                    ['created_at', 'ASC'],
                    ['updated_at', 'ASC']
                ]
            });

            return faculty;
        } catch (error) {
            throw error;
        }
    }
    async updateFaculty(id, facultyName) {
        try {
            const faculty = await Faculty.update({
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
    async deleteFaculty(facultyId, transaction) {
        try {
            const departments = await Department.findAll({
                where: {
                    faculty_id: facultyId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id']
            }); 
            const departmentIds = departments.map(item => item.id);
            if (departmentIds.length !== EnumServerDefinitions.EMPTY) {
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
                                faculty_id: facultyId,
                                status: EnumServerDefinitions.STATUS.ACTIVE
                            }
                        }
                    ]
                });
                const regularClass = await RegularClass.findAll({
                    where: {
                        department_id: {[Op.in]: departmentIds},
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['id']
                });
                const regularClassIds = regularClass.map(item => item.id);
                const subjectIds = subjects.map(item => item.id);
                await Department.update(
                    { status: EnumServerDefinitions.STATUS.NO_ACTIVE },
                    { where: { faculty_id: facultyId, status: EnumServerDefinitions.STATUS.ACTIVE }, transaction, fields: ['status'] }
                );
                let flag = false;
                if (regularClassIds.length !== EnumServerDefinitions.EMPTY) {
                    await RegularClass.update({
                        status: EnumServerDefinitions.STATUS.NO_ACTIVE
                    }, { where: { department_id: departmentIds, status: EnumServerDefinitions.STATUS.ACTIVE }, transaction, fields: ['status'] });
                    flag = true;
                }
                if (subjectIds.length !== EnumServerDefinitions.EMPTY) {
                    await Subject.update(
                        { status: EnumServerDefinitions.STATUS.NO_ACTIVE },
                        { where: { id: subjectIds, status: EnumServerDefinitions.STATUS.ACTIVE }, transaction, fields: ['status'] }
                    );
                    flag = true;
                }
               if (flag) {
                await Classroom.update(
                    { status: EnumServerDefinitions.STATUS.NO_ACTIVE },
                    { where: { [Op.or]: [{
                        subject_id: {[Op.in]: subjectIds}
                    }, {
                        regular_class_id: {[Op.in]: regularClassIds}
                    }], status: EnumServerDefinitions.STATUS.ACTIVE }, transaction, fields: ['status'] }
                );
               }
            }
            const faculty = await Faculty.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: facultyId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return !!faculty;
        } catch (error) {
            throw error;
        }
    }
    async activeFaculty(id, facultyName) {
        try {
            const dateNow = FormatUtils.formatDateNow();
            const faculty = await Faculty.update({
                faculty_name: facultyName,
                status: EnumServerDefinitions.STATUS.ACTIVE,
                created_at: dateNow,
                updated_at: dateNow
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.NO_ACTIVE
                }
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