const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const FormatUtils = require("../common/utils/format.utils");
const Classroom = require("../models/classroom.model");
const Department = require("../models/department.model");
const Subject = require("../models/subject.model");
const { Op } = require("sequelize");

class SubjectService {
    async findSubjectByName(subjectName) {
        try {
            const subject = await Subject.findOne({
                where: {
                    subject_name: subjectName
                }
            });
            return subject;
        } catch (error) {
            throw error;
        }
    }
    async findAllSubject() {
        try {
            const subjects = await Subject.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id', 'subject_name', 'department_id']
            });
            return subjects;
        } catch (error) {
            throw error;
        }
    }
    async findAllSubjectsAndClassroomQuantity() {
        try {
            const subjects = await Subject.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include:  [{
                    model: Classroom,
                    required: false,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: []
                }, {
                    model: Department,
                    required: false,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['department_name']
                }],
                attributes: ['id', 'subject_name', 'credit',
                    [Subject.sequelize.literal(`(SELECT COUNT(*) FROM classrooms WHERE classrooms.subject_id = Subject.id and classrooms.status = ${EnumServerDefinitions.STATUS.ACTIVE})`),
                        'classroom_quantity']],
                order: [
                    ['created_at', 'ASC'],
                    ['updated_at', 'ASC']
                ]
            });
            return subjects;
        } catch (error) {
            throw error;
        }
    }
    async findSubjectByDepartmentId(subjectId, departmentId) {
        try {
            const subject = await Subject.findOne({
                where: {
                    id: subjectId,
                    department_id: departmentId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id']
            });
            return subject;
        } catch (error) {
            throw error;
        }
    }
    async findAllSubjectByDepartmentId(departmentId) {
        try {
            const listSubject = await Subject.findAll({
                where: {
                    department_id: departmentId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return listSubject;
        } catch (error) {
            throw error;
        }
    }
    async checkSubjectExist(id) {
        try {
            const subject = await Subject.findOne({
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id']
            });
            return !!subject;
        } catch (error) {
            throw error;
        }
    }
    async updateSubject(id, subjectName, credit) {
        try {
            const isUpdate = await Subject.update({
                subject_name: subjectName,
                credit: credit
            }, {
                where: {
                    id: id,
                    status: {[Op.in] : [EnumServerDefinitions.STATUS.ACTIVE, EnumServerDefinitions.STATUS.CLOSE]}
                }
            });
            return isUpdate > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
    async deleteSubject(subjectId, transaction) {
        try {
            await Classroom.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    subject_id: subjectId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            const isDelete = await Subject.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: subjectId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            return isDelete > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
    async activeSubject(id, subjectName, departmentId, credit) {
        try {
            //const dateNow = FormatUtils.formatDateNow();
            const isActive = await Subject.update({
                subject_name: subjectName,
                department_id: departmentId,
                credit: credit,
                status: EnumServerDefinitions.STATUS.ACTIVE,
                // created_at: dateNow,
                // updated_at: dateNow
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.NO_ACTIVE
                }
            });
            return isActive > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
    async addSubject(subjectName, departmentId, credit) {
        try {
            const newSubject = await Subject.create({
                subject_name: subjectName,
                department_id: departmentId,
                credit: credit || 1
            });
            return newSubject;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new SubjectService;