const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const CommonService = require("../../common/utils/common_service");
const Classroom = require("../../models/classroom.model");
const Department = require("../../models/department.model");
const RegularClass = require("../../models/regular_class.model");
const Student = require("../../models/student.model");
const StudentList = require("../../models/student_list.model");
const Teacher = require("../../models/teacher.model");
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
                where: {
                    status: {
                        [Op.notIn]: [
                            EnumServerDefinitions.STATUS.NO_ACTIVE,
                            EnumServerDefinitions.STATUS.STORAGE
                        ]
                    }
                },
                include: [{
                    model: RegularClass,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
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
    async findAllClassroomsStorage(teacherId = null) {
        try {
            const classroomsList = await Classroom.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.STORAGE
                },
                include: [teacherId &&  {
                    model: Teacher,
                    required: true,
                    where: {
                        id: teacherId,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    through: {
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: []
                    },
                    attributes: []
                }, {
                    model: RegularClass,
                    required: true,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['class_name']
                }],
                attributes: ['id', 'class_name', 'semester', 'school_year', 'status']
            });
            return classroomsList;
        } catch (error) {
            throw error;
        }
    }
    async findTeachersAndStudentsBelongToClassByClassroomId(classroomId) {
        try {
            const result = await Classroom.findOne({
                where: {
                    id: classroomId,
                    status: { [Op.in]: [EnumServerDefinitions.STATUS.ACTIVE, EnumServerDefinitions.STATUS.CLOSE] }
                },
                include: [{
                    model: Teacher,
                    required: false,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['id', 'first_name', 'last_name'],
                    include: [{
                        model: Department,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: ['department_name']
                    }],
                    through: {
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: []
                    }
                }, {
                    model: Student,
                    required: false,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['id', 'first_name', 'last_name'],
                    include: [{
                        model: RegularClass,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: ['class_name']
                    }],
                    through: {
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: []
                    }
                }],
                attributes: ['id']
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
    async updateClassroom(id, className, semester, schoolYear) {
        try {
            const isUpdate = await Classroom.update({
                class_name: className,
                semester: semester,
                school_year: schoolYear,
                //regular_class_id: regularClassId,
                //subject_id: subjectId
            }, {
                where: {
                    id: id,
                    status: { [Op.in]: [EnumServerDefinitions.STATUS.ACTIVE, EnumServerDefinitions.STATUS.CLOSE] }
                }
            });
            return isUpdate > EnumServerDefinitions.EMPTY;
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
    async checkRoomMember(classroomId, userId, role) {
        try {
            const userRole = role === EnumServerDefinitions.ROLE.TEACHER ? { model: TeacherList, filed: 'teacher_id' } : { model: StudentList, filed: 'student_id' };
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
            }, { transaction: transaction });
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
            const isDelete = await Classroom.update({
                status: status
            }, {
                where: {
                    id: id,
                }
            });
            return isDelete > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
    async StorageClassroom(id) {
        try {
            const classroom = await Classroom.findByPk(id, {
                attributes: ['status']
            });
            if (classroom && (classroom.status === EnumServerDefinitions.STATUS.NO_ACTIVE)) {
                return false;
            }
            const isUpdate = await Classroom.update({
                status: EnumServerDefinitions.STATUS.STORAGE
            }, {
                where: {
                    id: id
                }
            });
            return isUpdate > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
    async deleteClassroom(id) {
        try {
            const isDelete = await Classroom.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: id,
                }
            });
            return isDelete > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
   async checkClassroomExist(classroomId) {
        try {
            const classroom = await Classroom.findOne({
                where: {
                    id: classroomId,
                status: {[Op.in] : [EnumServerDefinitions.STATUS.ACTIVE, EnumServerDefinitions.STATUS.CLOSE]} 
                },
                attributes: ['id']
            });
            return !!classroom;
        } catch (error) {
            throw error;
        }
   }
}

module.exports = new ClassroomService;