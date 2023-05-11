const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class QuestionCategory extends Model{}

QuestionCategory.init({}, {
    sequelize,
    modelName: 'QuestionCategory',
    tableName: 'questionCategories',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = QuestionCategory;