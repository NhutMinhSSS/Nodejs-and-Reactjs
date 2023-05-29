const { DataTypes, Model } = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class Account extends Model { }
Account.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                args: true,
                msg: 'Invalid email format',
            },
            isValidDomain(value) {
                if (!value.endsWith('@caothang.edu.vn')) {
                    throw new Error('Invalid email domain');
                }
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
        allowNull: false
    },
    status: {
        type: DataTypes.SMALLINT,
        defaultValue: 1,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Account',
    tableName: 'accounts',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at',
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
});

module.exports = Account;