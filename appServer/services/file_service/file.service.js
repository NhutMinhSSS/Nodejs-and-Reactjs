const File = require("../../models/file.model");
const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const { Op } = require("sequelize");
class FileService {
    async findFileById(id) {
        try {
            const file = await File.findOne({
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id', 'file_name', 'physical_name', 'file_path', 'file_type']
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
    // async removeFiles(listFileId , transaction) {
    //     try {
    //         const isRemove = await File.update({ 
    //             status: EnumServerDefinitions.STATUS.NO_ACTIVE
    //         }, {
    //             where: {
    //                 id: {[Op.in]: listFileId},
    //                 status: EnumServerDefinitions.STATUS.ACTIVE
    //             }, transaction
    //         });
    //         return isRemove > EnumServerDefinitions.EMPTY;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}

module.exports = new FileService;