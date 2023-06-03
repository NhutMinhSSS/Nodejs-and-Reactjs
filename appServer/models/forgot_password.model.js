const { Model, DataTypes } = require('sequelize');

const db = require('../config/connect_database.config');
const Account = require('./account.model');
const sequelize = db.getPool();

class ForgotPassword extends Model{}

ForgotPassword.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accounts',
            key: 'id'
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    create_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
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
    foreignKey: 'account_id'
});

module.exports = ForgotPassword;