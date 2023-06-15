const { DataTypes, DATE, Model} = require('sequelize');
const PostDetail = require('./post_detail.model');
const db = require('../config/connect_database.config');
const PostFile = require('./post_file.model');
const Comment = require('./comment.model');
const StudentExam = require('./student_exam.model');
const PostCategory = require('./post_category.model');
const Account = require('./account.model');
const Classroom = require('./classroom.model');
const sequelize = db.getPool();

class Post extends Model{}

Post.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrementL: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    create_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    post_category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'post_categories',
            key: 'id'
        }
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accounts',
            key: 'id'
        }
    },
    classroom_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'classrooms',
            key: 'id'
        }
    },
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'topics',
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
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

// Post.hasOne(PostDetail);
Post.belongsTo(PostCategory, { foreignKey: 'post_category_id', as: 'post_categories'});
Post.belongsTo(Classroom, { foreignKey: 'classroom_id', as: 'classrooms'});
Post.hasMany(PostFile, {foreignKey: 'post_id', as: 'post_files'});
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments'});
Post.hasMany(StudentExam, { foreignKey: 'exam_id', as: 'student_exams'});
Post.hasOne(PostDetail, { foreignKey: 'post_id', as: 'post_details'});
Post.belongsTo(Account, { foreignKey: 'account_id', as: 'accounts'});

module.exports = Post;