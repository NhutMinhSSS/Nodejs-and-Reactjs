const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const CommonService = require("../../common/utils/common_service");
const generateCode = require("../../common/utils/generate_class_code");
const Classroom = require("../../models/classroom.model");
const Student = require("../../models/student.model");
const StudentList = require("../../models/student_list.model");
const Teacher = require("../../models/teacher.model");
const TeacherList = require("../../models/teacher_list.model");


class ClassroomService {
    async findClassroomById(id) {
        try {
            const classroom = await Classroom.findOne({
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return classroom;
        } catch (error) {
            throw error;
        }
    }
    async findAllClassroom() {
        try {
            const classrooms = await Classroom.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return classrooms;
        } catch (error) {
            throw error;
        }
    }
    async updateClassroom(id, className, title, note, regularClassId, teacherId, subjectId, transaction){
        try {
            return await Classroom.update({
                class_code: classCode,
                class_name: className,
                title: title,
                note: note,
                regular_class_id: regularClassId,
                teacher_id: teacherId,
                subject_id: subjectId
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction: transaction
            });
        } catch (error) {
            throw error;
        }
    }
    async findAllMembersByClassroomId(classroomId) {
        try {
            const members = await CommonService.findMembersByClassroomId(classroomId);
            return members;
        } catch (error) {
            throw error;
        }
    }
    async findClassroomByClassCode(classCode) {
        try {
            const result = await Classroom.findOne({
                where: {
                    class_code: classCode,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
    async checkRoomMember(classroomId, userId, role) {
        try {
            const userRole = role === EnumServerDefinitions.ROLE.TEACHER ? {model: TeacherList, filed: 'teacher_id'} : {model: StudentList, filed: 'student_id'};
            const isClassroom = await (userRole.model).findOne({
               where: {
                classroom_id: classroomId,
                [userRole.filed]: userId,
                status: EnumServerDefinitions.STATUS.ACTIVE
               },
            });
            return !!isClassroom;
        } catch (error) {
            throw error;
        }
    }
    async createClassroom(className, title, note, regularClassId, teacherId, subjectId, transaction) {
        try {
            const classCode = await this.generateCodeWithCheck();
            const newClassroom = Classroom.create({
                class_code: classCode,
                class_name: className,
                title: title,
                note: note,
                regular_class_id: regularClassId,
                teacher_id: teacherId,
                subject_id: subjectId
            }, { transaction: transaction});
            return newClassroom;
        } catch (error) {
            throw error;
        }
    }
    async deleteClassroom(id) {
        try {
            return await Classroom.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            })
        } catch (error) {
            throw error;
        }
    }
    async isCodeExist(classCode) {
        try {
            const result = await this.findClassroomByClassCode(classCode);
            return !!result;
        } catch (error) {
            throw error;
        }
    }
    async generateCodeWithCheck() {
        try {
            let code = generateCode.classCode();
            let exist = await this.isCodeExist(code);

            while (exist) {
                code = generateCode.classCode();
                exist = await this.isCodeExist(code);
            }
            return code;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ClassroomService;