const { Model, DataTypes } = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class StudentFileSubmission extends Model{}

StudentFileSubmission.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    examId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'posts',
            key: 'id'
        }
    },
    fileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'files',
            key: 'id'
        }
    },
    studentExamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'studentExams',
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
    tableName: 'studentFileSubmissions',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = StudentFileSubmission;