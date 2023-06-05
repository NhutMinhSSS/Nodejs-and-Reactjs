const PostCategory = require("../models/post_category.model");

class PostCategoryService {
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