const { DataTypes, Model } = require('sequelize');

const db = require('../config/connect_database.config');
const Student = require('./student.model');
const Teacher = require('./teacher.model');
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
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
});

Account.hasOne(Student, {foreignKey: 'account_id'});
Account.hasOne(Teacher, {foreignKey: 'account_id'});
Student.belongsTo(Account, { foreignKey: 'account_id' });
Teacher.belongsTo(Account, { foreignKey: 'account_id' });

module.exports = Account;