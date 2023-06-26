const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database.config');
const Subject = require('./subject.model');
const Faculty = require('./faculty.model');
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
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Department.hasMany(Subject, { foreignKey: 'department_id'});
Department.belongsTo(Faculty, { foreignKey: 'faculty_id'});
Faculty.hasMany(Department, { foreignKey: 'faculty_id'});
Subject.belongsTo(Department, { foreignKey: 'department_id'});

module.exports = Department;