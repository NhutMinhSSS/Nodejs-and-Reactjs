const File = require("../../models/file.model");
const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
class FileService {
    async findFileById(id) {
        try {
            const file = await File.findOne({
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
            });
            return file;
        } catch (error) {
            throw error;
        }
    }
    async createFiles(listFiles, transaction) {
        try {
            const newListFiles = await File.bulkCreate(listFiles, { transaction: transaction});
            return newListFiles;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new FileService;