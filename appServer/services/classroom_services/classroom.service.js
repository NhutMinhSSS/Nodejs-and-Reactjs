const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const CommonService = require("../../common/utils/common_service");
const Classroom = require("../../models/classroom.model");
const RegularClass = require("../../models/regular_class.model");
const StudentList = require("../../models/student_list.model");
const TeacherList = require("../../models/teacher_list.model");
const { Op } = require("sequelize");


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
                include: [{
                    model: RegularClass,
                    where: {
                        status: {
                            [Op.notIn]: [
                              EnumServerDefinitions.STATUS.NO_ACTIVE,
                              EnumServerDefinitions.STATUS.STORAGE
                            ]
                          }
                    },
                    attributes: ['class_name']
                }],
                attributes: ['id', 'class_name', 'semester', 'school_year', 'status']
            });
            return classrooms;
        } catch (error) {
            throw error;
        }
    }
    async updateClassroom(id, className, semester, schoolYear){
        try {
            const isUpdate =  await Classroom.update({
                class_name: className,
                semester: semester,
                school_year: schoolYear,
                //regular_class_id: regularClassId,
                //subject_id: subjectId
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return !!isUpdate;
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
    // async findClassroomByClassCode(classCode) {
    //     try {
    //         const result = await Classroom.findOne({
    //             where: {
    //                 class_code: classCode,
    //                 status: EnumServerDefinitions.STATUS.ACTIVE
    //             }
    //         });
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
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
    async createClassroom(className, semester, schoolYear, regularClassId, subjectId, transaction) {
        try {
            const newClassroom = Classroom.create({
                class_name: className,
                semester: semester,
                school_year: schoolYear,
                regular_class_id: regularClassId,
                // teacher_id: teacherId,
                subject_id: subjectId
            }, { transaction: transaction});
            return newClassroom;
        } catch (error) {
            throw error;
        }
    }
    async CloseAndActiveClassroom(id) {
        try {
            const classroom = await Classroom.findByPk(id, {
                attributes: ['status']
            });
            if (classroom && (classroom.status === EnumServerDefinitions.STATUS.STORAGE || classroom.status === EnumServerDefinitions.STATUS.NO_ACTIVE)) {
                return false;
            }
            let status = classroom && classroom.status === 1 ? EnumServerDefinitions.STATUS.CLOSE : EnumServerDefinitions.STATUS.ACTIVE
            const isDelete =  await Classroom.update({
                status: status
            }, {
                where: {
                    id: id,                   
                }
            });
            return !!isDelete;
        } catch (error) {
            throw error;
        }
    }
    async StorageClassroom(id) {
        try {
            const isUpdate = await Classroom.update({
                status: EnumServerDefinitions.STATUS.STORAGE
            }, {
                where: {
                    id: id
                }
            });
            return !!isUpdate;
        } catch (error) {
            throw error;
        }
    }
    async deleteClassroom(id) {
        try {
            const isDelete =  await Classroom.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: id,                 
                }
            });
            return !!isDelete;
        } catch (error) {
            throw error;
        }
    }
    // async isCodeExist(classCode) {
    //     try {
    //         const result = await this.findClassroomByClassCode(classCode);
    //         return !!result;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // async generateCodeWithCheck() {
    //     try {
    //         let code = generateCode.classCode();
    //         let exist = await this.isCodeExist(code);

    //         while (exist) {
    //             code = generateCode.classCode();
    //             exist = await this.isCodeExist(code);
    //         }
    //         return code;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}

module.exports = new ClassroomService;