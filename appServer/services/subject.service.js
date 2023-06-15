const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const Department = require("../models/department.model");
const Subject = require("../models/subject.model");

class SubjectService {
    async findSubjectByDepartmentId(subjectId ,departmentId) {
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
    async addSubject(subjectName, departmentId, credit) {
        try {
            const newSubject = await Subject.create({
                subject_name: subjectName,
                department_id: departmentId,
                credit: credit || 1
            });
            return newSubject;
        } catch(error) {
            throw error;
        }
    }
}

module.exports = new SubjectService;