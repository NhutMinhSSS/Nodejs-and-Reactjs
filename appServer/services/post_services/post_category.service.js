const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const Post = require("../../models/post.model");
const PostCategory = require("../../models/post_category.model");

class PostCategoryService {
    async findAllPostCategory() {
        try {
            const listPostCategory = await PostCategory.findAll({
                status: EnumServerDefinitions.STATUS.ACTIVE
            });
            return listPostCategory;
        } catch (error) {
            throw error;
        }
    }
    async addPostCategory(categoryName) {
        try {
            const newCategory = await PostCategory.create({
                category_name: categoryName
            });
            return newCategory;
        } catch(error) {
            throw error;
        }
    }
    async updatePostCategory(id, categoryName) {
        try {
            const isUpdate =  await PostCategory.update({
                category_name: categoryName
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return isUpdate > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
    async deletePostCategory(id, transaction) {
        try {
            await Post.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, { where: {
                post_category_id: id,
                status: EnumServerDefinitions.STATUS.ACTIVE
            }, transaction});
            const isDelete = await PostCategory.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            return isDelete > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PostCategoryService;