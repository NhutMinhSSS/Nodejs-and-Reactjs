const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class StudentList extends Model{}

StudentList.init({}, {
    sequelize,
    modelName: 'StudentList',
    tableName: 'studentLists',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = StudentList;