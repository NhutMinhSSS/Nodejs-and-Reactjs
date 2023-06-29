const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const StudentFileSubmission = require("../../models/student_file_submission.model");

class StudentFileSubmissionService {
    async createStudentFileSubmission(studentExamId, listFileId, transaction) {
        try {
            const listStudentFile = listFileId.map(fileId => ({
                student_exam_id: studentExamId,
                file_id: fileId
            }));
            const newStudentFile = await StudentFileSubmission.bulkCreate(listStudentFile, {transaction});
            return newStudentFile;
        } catch (error) {
            throw error;
        }
    }
    async deleteStudentFileSubmission(id) {
        try {
            const isDelete = await StudentFileSubmission.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, { where: {
                id: id,
                status: EnumServerDefinitions.STATUS.ACTIVE
            }, transaction });
            return isDelete > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StudentFileSubmissionService;