const File = require("../../models/file.model");

class FileService {
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