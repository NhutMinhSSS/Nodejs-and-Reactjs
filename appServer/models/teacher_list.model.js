const {DataTypes, Model}= require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class TeacherList extends Model{}

TeacherList.init({}, {
    sequelize,
    modelName: 'TeacherList',
    tableName: 'teacherLists',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = TeacherList;