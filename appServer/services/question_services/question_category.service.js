const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const QuestionCategory = require("../../models/question_category.mode");

class QuestionCategoryService {
    async findAllQuestionCategory() {
        try {
            const listQuestionCategory = await QuestionCategory.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return listQuestionCategory;
        } catch (error) {
            throw error;
        }
    }
    async addQuestionCategory(categoryName) {
        try {
            const newCategory = await QuestionCategory.create({
                category_name: categoryName
            });
            return newCategory;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new QuestionCategoryService;