const PostFile = require("../../models/post_file.model");

class PostFileService {
    async addPostFiles(postId, listFileIds, transaction) {
        try {
            listPostFile = listFileIds.map(fileId  => ({
                post_id: postId,
                file_id: fileId 
            }));
            const newPostFile = await PostFile.bulkCreate(listPostFile, {transaction: transaction});
            return newPostFile;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PostFileService;