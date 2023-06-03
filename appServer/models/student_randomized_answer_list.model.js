const { Model, DataTypes } = require('sequelize');

const db = require('../config/connect_database.config');
const sequelize = db.getPool();

class StudentRandomizedAnswerList extends Model{}

StudentRandomizedAnswerList.init({
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
    answer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'answers',
            key: 'id'
        }
    },
    order: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'StudentRandomizedAnswerList',
    tableName: 'Student_randomized_answer_lists',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});