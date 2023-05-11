const { Model } = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class StudentFileSubmission extends Model{}

StudentFileSubmission.init({}, {
    sequelize,
    modelName: 'StudentFileSubmission',
    tableName: 'studentFileSubmissions',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = StudentFileSubmission;