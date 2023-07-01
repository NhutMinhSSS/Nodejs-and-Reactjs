const EnumServerDefinitions = require('../../common/enums/enum_server_definitions');
const CommonService = require('../../common/utils/common_service');
const TeacherList = require('../../models/teacher_list.model');
const { Op } = require('sequelize');

class ClassroomTeacherService {
    //Function find list classroom form teacher id
    async findClassroomsByTeacherId(teacherId) {
        try {
            const classrooms = await CommonService.findClassroomsByUser(teacherId, EnumServerDefinitions.ROLE.TEACHER);
            return classrooms;
        } catch (error) {
            throw error;
        }
    }
    // async isTeacherJoined(classroomId, teacherId) {
    //     try {
    //     const isJoined = await TeacherList.findOne({
    //         classroom_id: classroomId,
    //         teacher_id: teacherId,
    //         status: EnumServerDefinitions.STATUS.ACTIVE
    //     });
    //     return !!isJoined; 
    //     } catch(error) {
    //         throw error;
    //     }
    // }
    async checkTeacherNoActive(classroomId, teacherId) {
        try {
            const teacher = await TeacherList.findOne({
               where: {
                classroom_id: classroomId,
                teacher_id: teacherId,
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
               }
            });
            return teacher; 
            } catch(error) {
                throw error;
            }
    }
    async addTeacherToClassroom(classroomId, teacherId, transaction) {
        try{
            const newTeacher = await TeacherList.create({
                classroom_id: classroomId,
                teacher_id: teacherId
            }, { transaction });
            return newTeacher;
        } catch(error) {
            throw error;
        }
    }
    async addTeachersToClassroom(teacherIds, classroomId, transaction) {
        try {
            // const existingTeacherIds = await TeacherList.findAll({
            //     where: {
            //         teacher_id: {[Op.in]: teacherIds},
            //         classroom_id: classroomId
            //     },
            //     attributes: ['teacher_id'],
            //     transaction
            // });
            // const teachersToUpdate = existingTeacherIds.map(({ teacher_id }) => teacher_id);
            // const teachersToInsert = teacherIds.filter(teacherId => !teachersToUpdate.includes(teacherId));
            // if (teachersToInsert.length !== EnumServerDefinitions.EMPTY) {
            //     const teacherListInsert =  teachersToInsert.map(teacherId => ({
            //         classroom_id: classroomId,
            //         teacher_id: teacherId,
            //       }));
            //     await TeacherList.bulkCreate(teacherListInsert ,
            //         { transaction, updateOnDuplicate: ['status'] }
            //       );
            // }
            // if (teachersToUpdate.length !== EnumServerDefinitions.EMPTY) {
            //     await TeacherList.update({ status: EnumServerDefinitions.STATUS.ACTIVE}, {
            //         where: {
            //             classroom_id: classroomId,
            //             teacher_id: {[Op.in]: teacherIds}
            //         }, transaction
            //     });
            // }
            // return true;
            const query = `
            INSERT INTO teacher_lists (classroom_id, teacher_id, status)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE status = ?
        `;
        const values = teacherIds.map(teacherId => [classroomId, teacherId, EnumServerDefinitions.STATUS.ACTIVE, EnumServerDefinitions.STATUS.ACTIVE]);

        await TeacherList.sequelize.query(query, {
            replacements: values,
            transaction
        });

        return true;
        } catch (error) {
            throw error;
        }
    }
    async removeTeachersFromClassroom(classroomId, teacherIds) {
        try {
            const isRemove = await TeacherList.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    classroom_id: classroomId,
                    teacher_id: {[Op.in]: teacherIds},
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return isRemove > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new ClassroomTeacherService;