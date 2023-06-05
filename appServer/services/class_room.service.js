const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const generateCode = require("../common/utils/generate_class_code");
const Classroom = require("../models/class_room.model");


class ClassroomService {
    async findClassroomById(id) {
        try {
            const classroom = await Classroom.findOne({
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS
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
    async findStudentByClassroomId(id) {
        try {

        } catch(error) {
            throw error;
        }
    }
    async createClassroom(className, title, note, regularClassId, subjectId) {
        try {
            const classCode = await this.generateCodeWithCheck();
            const newClassroom = await Classroom.create({
                class_code: classCode,
                class_name: className,
                title: title,
                note: note,
                regular_class_id: regularClassId,
                subject_id: subjectId
            });
            return newClassroom;
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