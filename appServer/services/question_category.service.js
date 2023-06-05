const QuestionCategory = require("../models/question_category.mode");

class QuestionCategoryService {
    async addQuestionCategory(categoryName) {
        try {
            const newCategory =  await QuestionCategory.create({
                category_name: categoryName
            });
            return newCategory;
        } catch(error) {
            throw error;
        }
    }
}

module.exports = new QuestionCategoryService;