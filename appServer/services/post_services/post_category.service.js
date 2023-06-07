const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
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
}

module.exports = new PostCategoryService;