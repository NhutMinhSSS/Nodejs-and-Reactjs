const { DataTypes, Model } = require("sequelize");

const db = require("../config/connect_database");
const sequelize = db.getPool();

class Student extends Model{}

Student.init({}, { sequelize,
    modelName: 'Student',
    tableName: 'students',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = Student;
