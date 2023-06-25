const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database.config');
const sequelize = db.getPool();

class QuestionCategory extends Model{}

QuestionCategory.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'QuestionCategory',
    tableName: 'question_categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = QuestionCategory;