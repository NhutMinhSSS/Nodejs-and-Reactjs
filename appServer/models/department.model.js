const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();
//Bộ môn
class Department extends Model{}

Department.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    department_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    faculty_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'faculties',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.SMALLINT,
        defaultValue: 1,
        allowNull: false
    }
}, {
    sequelize, 
    modelName: 'Department',
    tableName: 'departments',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = Department;