const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class Question extends Model{}

Question.init({}, {
    sequelize,
    modelName: 'Question',
    tableName: 'Questions',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = Question;