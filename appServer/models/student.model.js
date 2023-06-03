const { DataTypes, Model } = require('sequelize');

const db = require('../config/connect_database.config');
const Account = require('./account.model');
const sequelize = db.getPool();

class Student extends Model{}

Student.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    student_code: {
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
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.SMALLINT,
        defaultValue: 1,
        allowNull: false
    }
}, { sequelize,
    modelName: 'Student',
    tableName: 'students',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

Student.belongsTo(Account, {foreignKey: 'account_id'});

module.exports = Student;
