const {DataTypes, Model, DATE} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class RegularClass extends Model{}

RegularClass.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    className: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    createDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'departments',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.SMALLINT,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'RegularClass',
    tableName: 'regularClass',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = RegularClass;