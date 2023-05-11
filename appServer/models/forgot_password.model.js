const { Model, DataTypes } = require('sequelize');

const db = require('../config/connect_database');
const Account = require('./account_classroom.model');
const sequelize = db.getPool();

class ForgotPassword extends Model{}

ForgotPassword.init({
    id: {
        type: DataTypes.INTEGER.length(20),
        primaryKey: true,
        autoIncrement: true
    },
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'AccountClassroom',
            key: 'id'
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    createDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'ForgotPassword',
    tableName: 'forgotPasswords',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

ForgotPassword.belongsTo(Account, {
    foreignKey: 'accountId'
});

module.exports = ForgotPassword;