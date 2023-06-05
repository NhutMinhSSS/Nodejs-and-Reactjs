const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const db = require("../config/connect_database.config");
const logger = require("../config/logger.config");
const sequelize = db.getPool();

class ClassroomController {
    async createClassroom(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const className = req.body.nameClass;
            const title = req.body.title;
            const note = req.body.note;
            //const regularClassId = req.body.selectedClass;
            //const subjectId = req.body.selectedSubject;
        } catch(error) {
            logger.error(error);
            await transaction.rollback();
            return res.status(SystemConst.STATUS_CODE.INTERNAL_SERVER).json({ result_message: EnumMessage.DEFAULT_ERROR});
        }
    }
}