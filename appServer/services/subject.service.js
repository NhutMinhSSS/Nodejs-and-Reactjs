const Subject = require("../models/subject.model");

class SubjectService {
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