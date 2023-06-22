const {DataTypes, Model, DATE} = require('sequelize');

const db = require('../config/connect_database.config');
const Department = require('./department.model');
const sequelize = db.getPool();

class RegularClass extends Model{}

RegularClass.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    class_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    create_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    department_id: {
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
    tableName: 'regular_class',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

RegularClass.belongsTo(Department, {foreignKey: 'department_id'});

module.exports = RegularClass;