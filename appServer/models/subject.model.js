const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database.config');
const Department = require('./department.model');
const Classroom = require('./classroom.model');
const sequelize = db.getPool();
//Môn học
class Subject extends Model{}

Subject.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    subject_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    credit: {
        type: DataTypes.SMALLINT,
        defaultValue: 1
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
        defaultValue: 1,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Subject',
    tableName: 'subjects',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Subject.hasMany(Classroom, { foreignKey: 'subject_id'});
Subject.belongsTo(Department, { foreignKey: 'department_id'});

module.exports = Subject;