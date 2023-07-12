const { Op } = require("sequelize");
const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const StudentFileSubmission = require("../../models/student_file_submission.model");
const File = require("../../models/file.model");

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
    async deleteStudentFileSubmission(listFileIds) {
        const transaction = await StudentFileSubmission.sequelize.transaction()
        try {
            const studentFileSubmissionIds = StudentFileSubmission.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: {
                    model: File,
                    where: {
                        id: {[Op.in]: listFileIds},
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['']
                },
                attributes: ['id']
            });
            const isDelete = await StudentFileSubmission.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, { where: {
                id: {[Op.in]: studentFileSubmissionIds.id},
                status: EnumServerDefinitions.STATUS.ACTIVE
            }, transaction });
            await transaction.commit();
            return isDelete > EnumServerDefinitions.EMPTY;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new StudentFileSubmissionService;