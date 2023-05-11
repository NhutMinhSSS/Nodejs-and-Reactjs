const { Model } = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class StudentExam extends Model{}

StudentExam.init({}, {
    sequelize,
    modelName: 'StudentExam',
    tableName: 'studentExams',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = StudentExam;