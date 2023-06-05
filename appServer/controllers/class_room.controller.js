const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const db = require("../config/connect_database.config");
const logger = require("../config/logger.config");
const ClassroomService = require("../services/class_room.service");
const sequelize = db.getPool();

class ClassroomController {
    async createClassroom(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const className = req.body.nameClass;
            const title = req.body.title || null;
            const note = req.body.note || null;
            if (!className) {
                return res.status(SystemConst.STATUS_CODE.BAD_REQUEST).json({
                    result_message: "Required Name class"
                });
            }
            //const regularClassId = req.body.selectedClass;
            //const subjectId = req.body.selectedSubject;
            await ClassroomService.createClassroom(className,title,note,1,1);
            return res.json({
                result_message: EnumMessage.RESPONSE.SUCCESS
            });
        } catch(error) {
            logger.error(error);
            await transaction.rollback();
            return res.status(SystemConst.STATUS_CODE.INTERNAL_SERVER).json({ result_message: EnumMessage.DEFAULT_ERROR});
        }
    }
}

module.exports = new ClassroomController;