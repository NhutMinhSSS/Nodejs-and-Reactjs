const {DataTypes, Model} = require('sequelize');

const db = require("../config/connect_database");
const AccountClassroom = require('./account_classroom.model');
const sequelize = db.getPool();

class Teacher extends Model{}

Teacher.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    teachCode: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    gender: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    CCCD: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accountClassrooms',
            key: 'id'
        }
    },
    departmentId: {
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
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

Teacher.belongsTo(AccountClassroom, {foreignKey: 'accountId'});

module.exports = Teacher;