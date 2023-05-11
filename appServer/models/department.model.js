const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class Department extends Model{}

Department.init({}, {
    sequelize, 
    modelName: 'Department',
    tableName: 'departments',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = Department;