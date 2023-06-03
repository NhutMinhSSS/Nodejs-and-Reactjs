const { STATUS } = require("../common/enums/enum_server_definitions");
const generateCode = require("../common/utils/generate_class_code");
const Classroom = require("../models/class_room.model");


class ClassroomService {
    async findClassroomById(id) {
        try {
            const classroom = await Classroom.findOne({
                where: {
                    id: id,
                    status: STATUS
                }
            });
            return classroom;
        } catch (error) {
            throw error;
        }
    }
    async findClassroomByClassCode(classCode) {
        try {
            const result = await Classroom.findOne({
                where: {
                    class_code: classCode
                }
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
    async createClassroom(className, title, note, regularClassId) {
        const transaction = await Classroom.sequelize.transaction();
        try {
            const classCode = await this.generateCodeWithCheck();
            const newClassroom = await Classroom.create({
                class_code: classCode,
                class_name: className,
                title: title,
                note: note,
                regular_class_id: regularClassId
            }, { transaction });
            await transaction.commit();
            return newClassroom;
        } catch (error) {
            await transaction.rollback();
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