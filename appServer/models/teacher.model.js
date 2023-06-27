const { DataTypes, Model } = require('sequelize');
const db = require('../config/connect_database.config');
const Classroom = require('./classroom.model');
const Department = require('./department.model');
const sequelize = db.getPool();

class Teacher extends Model { }

Teacher.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    teacher_code: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        unique: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    gender: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    CCCD: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accounts',
            key: 'id'
        }
    },
    department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'departments',
            key: 'id'
        }
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.SMALLINT,
        defaultValue: 1,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'teachers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Classroom.belongsTo(Teacher, {foreignKey: 'teacher_id', as: 'teachers'});
Teacher.belongsTo(Department, { foreignKey: 'department_id'});

module.exports = Teacher;