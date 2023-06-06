const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const db = require("../config/connect_database.config");
const logger = require("../config/logger.config");
const ClassroomService = require("../services/class_room.service");
const ClassroomTeacherService = require("../services/classroom_teacher.service");
const TeacherService = require("../services/teacher.service");
const sequelize = db.getPool();

class ClassroomController {
    async joinClassroom(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const role = req.user.role;
            if (role == 0){
                //
            } else if (role == 1) {
                //
            } else {
                return res.status(SystemConst.STATUS_CODE.BAD_REQUEST).json({
                    result_message: EnumMessage.RESPONSE.SUCCESS,
                    error_message: EnumMessage.ROLE_INVALID
                });
            }
            await transaction.commit();
            return res.json({
                result_message: EnumMessage.RESPONSE.SUCCESS
            })
        } catch (error) {
            await transaction.rollback();
            logger.error(error);
            return res.status(SystemConst.STATUS_CODE.INTERNAL_SERVER).json({
                result_message: EnumMessage.RESPONSE.FAILED,
                error_message: EnumMessage.DEFAULT_ERROR
            });
        }
    }
    async createClassroom(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const className = req.body.nameClass;
            const title = req.body.title || null;
            const note = req.body.note || null;
            const accountId = req.user.account_id;
            //const regularClassId = req.body.selectedClass;
            //const subjectId = req.body.selectedSubject;
            if (!className) {
                return res.status(SystemConst.STATUS_CODE.BAD_REQUEST).json({
                    result_message: EnumMessage.RESPONSE.FAILED,
                    error_message: EnumMessage.REQUIRED_CLASS_NAME
                });
            }
            const newClassroom = await ClassroomService.createClassroom(className, title, note, 1, 1, transaction);
            const teacher = await TeacherService.findTeacherByAccountId(accountId);
            if (!teacher) {
                await transaction.rollback();
                return res.status(SystemConst.STATUS_CODE.NOT_FOUND).json({
                    result_message: EnumMessage.RESPONSE.FAILED,
                    error_message: EnumMessage.TEACHER_NO_EXISTS
                });
            } else {
                await ClassroomTeacherService.addTeacherToClassroom(newClassroom.id, teacher.id, transaction);
            }
            await transaction.commit();
            return res.json({
                result_message: EnumMessage.RESPONSE.SUCCESS
            });
        } catch (error) {
            await transaction.rollback();
            logger.error(error);
            return res.status(SystemConst.STATUS_CODE.INTERNAL_SERVER).json({
                result_message: EnumMessage.RESPONSE.FAILED,
                error_message: EnumMessage.DEFAULT_ERROR
            });
        }
    }
}

module.exports = new ClassroomController;