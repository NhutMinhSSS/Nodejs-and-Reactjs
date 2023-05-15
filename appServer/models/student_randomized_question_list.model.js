const { Model, DataTypes } = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class StudentRandomizedQuestionList extends Model{}

StudentRandomizedQuestionList.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    studentExamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'studentExams',
            key: 'id'
        }
    },
    questionId: {
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
    tableName: 'studentRandomizedQuestionLists',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = StudentRandomizedQuestionList;