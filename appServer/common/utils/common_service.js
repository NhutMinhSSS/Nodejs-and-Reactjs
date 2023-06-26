const EnumServerDefinitions = require('../enums/enum_server_definitions');
const Teacher = require('../../models/teacher.model');
const Student = require('../../models/student.model');
const Classroom = require('../../models/classroom.model');
const logger = require('../../config/logger.config');
const FacultyService = require('../../services/faculty.service');

class CommonService {
    //function find list classroom form student id or teacher id with condition role
    async findClassroomsByUser(userId, userRole) {
        try {
            let listClassroomUser;
            if (userRole === EnumServerDefinitions.ROLE.TEACHER) {
                listClassroomUser = await Classroom.findAll({
                    where: {                       
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    include: [
                        {
                            model: Teacher,
                            where: {
                                id: userId,
                                status: EnumServerDefinitions.STATUS.ACTIVE
                            },
                            attributes: [],
                            through: {
                                attributes: [],
                                where: {
                                    status: EnumServerDefinitions.STATUS.ACTIVE
                                }
                            }
                        }
                    ],
                    attributes: ['id', 'class_name', 'semester', 'school_year']
                });
            } else {
                listClassroomUser = await Classroom.findAll({
                    where: {                        
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    include: [
                        {
                            model: Student,
                            where: {
                                id: userId,
                                status: EnumServerDefinitions.STATUS.ACTIVE
                            },
                            attributes: [],
                            through: {
                                attributes: [],
                                where: {
                                    status: EnumServerDefinitions.STATUS.ACTIVE
                                }
                            }
                        },
                        {
                            model: Teacher,
                            where: {
                                status: EnumServerDefinitions.STATUS.ACTIVE
                            },
                            as: 'teachers',
                            attributes: ['first_name' ,'last_name']
                        }
                    ],
                    attributes: ['id', 'class_name', 'semester', 'school_year']
                });
                listClassroomUser = this.getListClassroomForStudent(listClassroomUser);
            }
            return listClassroomUser;
        } catch (error) {
            throw error;
        }
    }
    getListClassroomForStudent(listClassroomUser) {
        return listClassroomUser.map(({ teachers, ...item }) => ({
            teacher_first_name: item.teachers.first_name,
            teacher_last_name: item.teachers.last_name,
            ...item
        }));
    }
    async findMembersByClassroomId(classroomId) {
        try {
            const listClassroomMembers = await Classroom.findOne({
               where : {
                id: classroomId,
                status: EnumServerDefinitions.STATUS.ACTIVE
               },
               include: [
                {
                    model: Student,
                    where: {
                        status: EnumServerDefinitions
                    },
                    attributes: ['id', 'first_name', 'last_name'],
                    through: {
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        }
                    }
                }, {
                    model: Teacher,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['id', 'first_name', 'last_name'],
                    through: {
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        }
                    }
                }
               ]
            });
            return {
                list_teachers: listClassroomMembers.Students,
                list_students: listClassroomMembers.Teachers
            };
        } catch (error) {
            throw error;
        }
    }
    async checkCCCDUserExist(CCCD, role) {
        try {
            let isCheck;
            if (role === EnumServerDefinitions.ROLE.TEACHER) {
                isCheck = await Teacher.findOne({
                    where: {
                        CCCD: CCCD
                    },
                    attributes: ['id']
                });
            } else {
                isCheck = await Student.findOne({
                    where: {
                        CCCD: CCCD
                    },
                    attributes: ['id']
                });
            }
            return isCheck;
        } catch (error) {
            throw error;
        }
    }
    async getTeacherCodeOrStudentCodeByAccountId(accountId, role) {
        try {
            let userInfo = role === EnumServerDefinitions.ROLE.TEACHER ? { model: Teacher, user_code: 'teacher_code'}  
            : { model: Student, user_code: 'student_code'}
            const user = await userInfo.model.findOne({
                where : {
                    account_id: accountId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: [userInfo.user_code]
            });
            return {
                user_code: user[userInfo.user_code]
            }
        } catch (error) {
            logger.error(error);
            return
        }
    }
}

module.exports = new CommonService;