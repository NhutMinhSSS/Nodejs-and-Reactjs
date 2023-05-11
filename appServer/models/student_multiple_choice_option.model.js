const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class StudentMultipleChoiceOption extends Model{}

StudentOption.init({}, {
    sequelize,
    modelName: 'StudentMultipleChoiceOption',
    tableName: 'studentMultipleChoiceOptions',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = StudentMultipleChoiceOption;