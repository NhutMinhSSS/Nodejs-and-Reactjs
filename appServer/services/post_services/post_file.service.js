const { Op } = require("sequelize");
const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const File = require("../../models/file.model");
const PostFile = require("../../models/post_file.model");

class PostFileService {
    async addPostFiles(postId, listFileIds, transaction) {
        try {
            const listPostFile = listFileIds.map(fileId => ({
                post_id: postId,
                file_id: fileId
            }));
            const newPostFile = await PostFile.bulkCreate(listPostFile, { transaction });
            return newPostFile;
        } catch (error) {
            throw error;
        }
    }
    async deletePostFileByFileIds(fileIds, transaction) {
        try {
            const postFileIds = await PostFile.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: {
                    model: File,
                    where: {
                        id: { [Op.in]: fileIds },
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    }
                },
                attributes: ['id']
            });
            const isDelete = await PostFile.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: { [Op.in]: postFileIds.map(item => item.id) },
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            return isDelete > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error
        }
    }
    async deletePostFile(postId, transaction) {
        try {
            const isDelete = await PostFile.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    post_id: postId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            return isDelete > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PostFileService;