const { DataTypes, Model } = require('sequelize');

const db = require('../config/connect_database.config');
const Question = require('./question.model');
const sequelize = db.getPool();

class StudentAnswerOption extends Model { }

StudentAnswerOption.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'questions',
            key: 'id'
        }
    },
    answer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'answers',
            key: 'id'
        }
    },
    essay_answer: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    student_exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'student_exams',
            key: 'id'
        }
    },
    score: {
        type: DataTypes.FLOAT,
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
    modelName: 'StudentAnswerOption',
    tableName: 'student_answer_options',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Question.hasMany(StudentAnswerOption, {foreignKey: 'question_id'});

module.exports = StudentAnswerOption;