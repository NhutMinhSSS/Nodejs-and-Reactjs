const { Model, DataTypes } = require('sequelize');

const db = require('../config/connect_database.config');
const sequelize = db.getPool();

class StudentRandomizedQuestionList extends Model{}

StudentRandomizedQuestionList.init({
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
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'questions',
            key: 'id'
        }
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'StudentRandomizedQuestionList',
    tableName: 'student_randomized_question_lists',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = StudentRandomizedQuestionList;