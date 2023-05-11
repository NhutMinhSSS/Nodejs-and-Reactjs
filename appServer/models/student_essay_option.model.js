const { Model } = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class StudentEssayOption extends Model{}

StudentEssayOption.init({}, {
    sequelize,
    modelName: 'StudentEssayOption',
    tableName: 'studentEssayOptions',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = StudentEssayOption;