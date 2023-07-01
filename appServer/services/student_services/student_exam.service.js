const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const StudentExam = require("../../models/student_exam.model");
const StudentList = require("../../models/student_list.model");

class StudentExamService {
    async checkStudentExamByIdAndStudentId(id, studentId) {
        try {
            const studentExam = await StudentExam.findOne({
                where: {
                    id: id,
                    student_id: studentId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id']
            });
            return studentExam;
        } catch (error) {
            throw error;
        }
    }
    async checkStudentExamNoActive(postId, studentId) {
        try {
            const student = await StudentList.findOne({
                where: {
                    exam_id: postId,
                    student_id: studentId,
                    status: EnumServerDefinitions.STATUS.NO_ACTIVE
                }
            });
            return student;
        } catch (error) {
            throw error;
        }
    }
    async addStudentExamJoinRoom(postId, studentId, transaction) {
        try {
            const studentExam = this.checkStudentExamNoActive(postId, studentId);
            if (studentExam) {
                await StudentExam.update({ status: EnumServerDefinitions.STATUS.ACTIVE }, {
                    where: {
                        id: studentExam.id
                    }, transaction: transaction
                })
            }
        } catch (error) {
            throw error;
        }
    }
    async addStudentExams(studentExams, transaction) {
        try {
            // const listStudentExams = studentIds.map(item => ({
            //     exam_id: postId,
            //     student_id: item
            // }));
            const newStudentExams = await StudentExam.bulkCreate(studentExams,
                     { transaction, updateOnDuplicate: ['status'] });
            return newStudentExams;
        } catch (error) {
            throw error;
        }
    }
    async updateStudentExam(id, finishDate, totalScore, submission, transaction) {
        try {
            const studentExam = await StudentExam.update({
                finish_date: finishDate,
                total_score: totalScore,
                submission: submission ?? undefined
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            return studentExam > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StudentExamService;