const {DataTypes, Model} = require('sequelize');

const db = require("../config/connect_database");
const sequelize = db.getPool();

class Teacher extends Model{}

Teacher.init({}, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'teachers',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = Teacher;