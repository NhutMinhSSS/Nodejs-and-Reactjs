const {DataTypes, Model} = require('sequelize');
const db = require('../config/connect_database.config');
const sequelize = db.getPool();
const Answer = require('./answer.model');
const StudentRandomizedQuestionList = require('./student_randomized_question_list.model');
const StudentRandomizedAnswerList = require('./student_randomized_answer_list.model');

class Question extends Model{}

Question.init({
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
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    question_category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'question_categories',
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
    modelName: 'Question',
    tableName: 'questions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
Question.hasOne(StudentRandomizedQuestionList, { foreignKey: 'question_id'});
Question.hasMany(StudentRandomizedAnswerList, { foreignKey: 'question_id'});
StudentRandomizedQuestionList.belongsTo(Question, { foreignKey: 'question_id'});
//StudentRandomizedQuestionList.hasOne(Question, { foreignKey: 'question_id'});

module.exports = Question;