const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class Answer extends Model{}

Answer.init({}, {
    sequelize,
    modelName: 'Answer',
    tableName: 'answers',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = Answer;