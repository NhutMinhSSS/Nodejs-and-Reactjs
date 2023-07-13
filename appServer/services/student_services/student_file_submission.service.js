const { Op } = require("sequelize");
const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const StudentFileSubmission = require("../../models/student_file_submission.model");
const File = require("../../models/file.model");

class StudentFileSubmissionService {
    async checkFileSubmissionByStudentExam(studentExamId) {
        try {
            const fileStudentExam = await StudentFileSubmission.count({
                where: {
                    student_exam_id: studentExamId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id']
            });
            return fileStudentExam;
        } catch (error) {
            throw error;
        }
    }
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
    async deleteStudentFileSubmission(listFileIds, transaction) {
        try {
            const studentFileSubmissionIds = await StudentFileSubmission.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: [{
                    model: File,
                    where: {
                        id: {[Op.in]: listFileIds},
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: []
                }],
                attributes: ['id']
            });
            const isDelete = await StudentFileSubmission.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, { where: {
                id: {[Op.in]: studentFileSubmissionIds.map(item => item.id)},
                status: EnumServerDefinitions.STATUS.ACTIVE
            }, transaction });
            return isDelete > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StudentFileSubmissionService;