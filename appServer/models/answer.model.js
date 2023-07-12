const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database.config');
const Question = require('./question.model');
const StudentRandomizedAnswerList = require('./student_randomized_answer_list.model');
const sequelize = db.getPool();

class Answer extends Model{}

Answer.init({
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
    answer: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    correct_answer: {
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
    modelName: 'Answer',
    tableName: 'answers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

StudentRandomizedAnswerList.belongsTo(Answer, { foreignKey: 'answer_id'});
Answer.hasOne(StudentRandomizedAnswerList, { foreignKey: 'answer_id'});
Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers'});

module.exports = Answer;