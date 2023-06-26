const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const Classroom = require("../models/classroom.model");
const Department = require("../models/department.model");
const Subject = require("../models/subject.model");

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
    async findAllSubjects(countClassroom = false) {
        try {
            const subjects = await Subject.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: countClassroom ? [{
                    model: Classroom,
                    required: false,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: []
                }] : [],
                attributes: ['id', 'subject_name', 'credit',
                    countClassroom ? [Subject.sequelize.literal(`SELECT COUNT(*)
                FROM classrooms
                WHERE classrooms.subject_id = Subject.id and classrooms.status = ${EnumServerDefinitions.STATUS.ACTIVE}`)] : []],
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
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, include: [{
                    model: Department,
                    where: {
                        id: departmentId,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    }
                }]
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
    async findAllSubject() {
        try {
            const subjects = await Subject.findAll({
                status: EnumServerDefinitions.STATUS
            });
            return subjects;
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
    async updateSubject(id, subjectName, departmentId, credit) {
        try {
            const subject = await Subject.update({
                subject_name: subjectName,
                department_id: departmentId,
                credit: credit
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return !!subject;
        } catch (error) {
            throw error;
        }
    }
    async deleteSubject(id, transaction) {
        try {
            await Classroom.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    subject_id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            const subject = await Subject.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            return !!subject;
        } catch (error) {
            throw error;
        }
    }
    async activeSubject(id, departmentId, credit) {
        try {
            const subject = await Subject.update({
                department_id: departmentId,
                credit: credit,
                status: EnumServerDefinitions.STATUS.ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.NO_ACTIVE
                }
            });
            return !!subject;
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