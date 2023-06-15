const EnumServerDefinitions = require('../enums/enum_server_definitions');
const EnumMessage = require('../enums/enum_message');
const Teacher = require('../../models/teacher.model');
const Student = require('../../models/student.model');
const Classroom = require('../../models/classroom.model');
const moment = require('moment-timezone');
const SystemConst = require('../consts/system_const');
const logger = require('../../config/logger.config');
const ServerResponse = require('./server_response');
const TeacherService = require('../../services/teacher_services/teacher.service');
const StudentService = require('../../services/student_services/student.service');

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
                                teacher_id: userId,
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
                    ]
                });
            } else if (userRole === EnumServerDefinitions.ROLE.STUDENT) {
                listClassroomUser = await Classroom.findAll({
                    where: {                        
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    include: [
                        {
                            model: Student,
                            where: {
                                student_id: userId,
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
                    ]
                });
            } else {
                throw new Error(EnumMessage.ROLE_INVALID);
            }
            return listClassroomUser;
        } catch (error) {
            throw error;
        }
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
    getGVOrST(role) {
        return role === EnumServerDefinitions.ROLE.TEACHER ? 'GV' : 'SV'
    }
    checkPostsDeadline(dateString) {
        const timeZone = SystemConst.TIME_ZONE;
        const now = moment().tz(timeZone);
        const tomorrow = moment().tz(timeZone).add(1,'day');
        const exam_deadline = moment(dateString);
        return exam_deadline <= tomorrow && now < exam_deadline;
    }
}

module.exports = new CommonService;