const { Model, DataTypes } = require('sequelize');

const db = require('../config/connect_database.config');
const File = require('./file.model');
const sequelize = db.getPool();

class StudentFileSubmission extends Model{}

StudentFileSubmission.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    student_exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'student_exams',
            key: 'id'
        }
    },
    file_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'files',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'StudentFileSubmission',
    tableName: 'student_file_submissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

StudentFileSubmission.belongsTo(File, {foreignKey: 'file_id'});

module.exports = StudentFileSubmission;