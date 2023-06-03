const { Model, DataTypes } = require('sequelize');

const db = require('../config/connect_database.config');
const sequelize = db.getPool();

class StudentExam extends Model{}

StudentExam.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'posts',
            key: 'id'
        }
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'students',
            key: 'id'
        }
    },
    finish_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    total_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    submission: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'StudentExam',
    tableName: 'student_exams',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = StudentExam;