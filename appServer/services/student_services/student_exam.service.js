const { Op } = require("sequelize");
const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const StudentExam = require("../../models/student_exam.model");
const Student = require("../../models/student.model");

class StudentExamService {
    async findStudentByStudentExamId(studentExamId) {
        try {
            const studentExam = await StudentExam.findOne({
                where: {
                    id: studentExamId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: [{
                    model: Student,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['student_code','first_name', 'last_name']
                }],
                attributes: ['id']
            });
            return studentExam;
        } catch (error) {
            throw error;
        }
    }
    async findStudentExam(postId, studentId) {
        try {
            const studentExam = await StudentExam.findOne({
                where: {
                    exam_id: postId,
                    student_id: studentId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id', 'finish_date', 'submission']
            });
            return studentExam;
        } catch (error) {
            throw error;
        }
    }
    async checkStudentExamByIdAndStudentId(id, studentId) {
        try {
            const studentExam = await StudentExam.findOne({
                where: {
                    id: id,
                    student_id: studentId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id', 'submission']
            });
            return studentExam;
        } catch (error) {
            throw error;
        }
    }
    async findStudentsExamsByPostId(postId) {
        try {
            const studentExams = await StudentExam.findAll({
                where: {
                    exam_id: postId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['student_id']
            });
            return studentExams;
        } catch (error) {
            throw error;
        }
    }
    // async checkStudentExamNoActive(postId, studentId) {
    //     try {
    //         const student = await StudentList.findOne({
    //             where: {
    //                 exam_id: postId,
    //                 student_id: studentId,
    //                 status: EnumServerDefinitions.STATUS.NO_ACTIVE
    //             }
    //         });
    //         return student;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // async addStudentExamJoinRoom(postId, studentId, transaction) {
    //     try {
    //         const studentExam = this.checkStudentExamNoActive(postId, studentId);
    //         if (studentExam) {
    //             await StudentExam.update({ status: EnumServerDefinitions.STATUS.ACTIVE }, {
    //                 where: {
    //                     id: studentExam.id
    //                 }, transaction: transaction
    //             })
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    async addStudentExams(studentExams, transaction) {
        try {
            const existingStudentExams = await StudentExam.findAll({
                where: {
                    exam_id: {[Op.in]: studentExams.map(({ exam_id }) => exam_id)},
                    student_id: {[Op.in]: studentExams.map(({ student_id }) => student_id)}
                },
                attributes: ['exam_id', 'student_id']
            });

            const existingStudentExamsMap = existingStudentExams.reduce((map, { exam_id, student_id }) => {
                map[`${exam_id}-${student_id}`] = true;
                return map;
            }, {});
            const studentExamsToCreate = studentExams.filter(({ exam_id, student_id }) => !existingStudentExamsMap[`${exam_id}-${student_id}`]);
            //const studentExamsToUpdate = studentExams.filter(({ exam_id, student_id }) => existingStudentExamsMap[`${exam_id}-${student_id}`]);
            if (studentExamsToCreate.length !== EnumServerDefinitions.EMPTY) {
                await StudentExam.bulkCreate(studentExamsToCreate, { transaction });
            }
    
            // if (studentExamsToUpdate.length !== EnumServerDefinitions.EMPTY) {
            //     const updatePromises = studentExamsToUpdate.map(({ exam_id, student_id }) =>
            //         StudentExam.update({ status: EnumServerDefinitions.STATUS.ACTIVE }, {
            //             where: { exam_id, student_id },
            //             transaction
            //         })
            //     );
            //     await Promise.all(updatePromises);
            // }
            return true;
        } catch (error) {
            throw error;
        }
    }
    async updateStudentExam(id, finishDate, totalScore, submission, transaction) {
        try {
            const updateData = {
                total_score: totalScore,
                submission: submission
              };
              if (finishDate) {
                updateData.finish_date = finishDate;
              }
            //   if (submission) {
            //     updateData.submission = submission;
            //   }
            const studentExam = await StudentExam.update(updateData, {
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
    async updateListStudentExamsByPostId(listStudentIds, postId, transaction) {
        try {
            const existingStudentExam = await StudentExam.findAll({
                where: {
                    exam_id: postId,
                    student_id: {[Op.in]: listStudentIds}
                }
            });
            const studentsExamToUpdate = existingStudentExam.map(({student_id}) => student_id);
            const studentsExamToAdd = listStudentIds.filter(studentId => !studentsExamToUpdate.includes(studentId));
            if (studentsExamToUpdate.length > EnumServerDefinitions.EMPTY) {
                await StudentExam.update({
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, {
                    where: {
                        exam_id: postId,
                        student_id: {[Op.in]: studentsExamToUpdate},
                        status: EnumServerDefinitions.STATUS.NO_ACTIVE
                    }, transaction
                });
            }
            if (studentsExamToAdd.length > EnumServerDefinitions.EMPTY) {
                const listStudentExam = studentsExamToAdd.map(item => ({
                    exam_id: postId,
                    student_id: item
               }));
                await StudentExam.bulkCreate(listStudentExam, {transaction});
            }
            const result = {
                exam_to_add: studentsExamToAdd,
                exam_to_update: studentsExamToUpdate 
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
    async removeStudentExamsByPostId(listStudentExam, postId, transaction) {
        try {
            const isDelete = await StudentExam.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    exam_id: postId,
                    student_id: {[Op.in]: listStudentExam}
                }, transaction
            });
            return isDelete > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StudentExamService;