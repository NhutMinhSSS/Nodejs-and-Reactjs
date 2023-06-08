const { DataTypes, DATE, Model} = require('sequelize');
const PostDetail = require('./post_detail.model');
const db = require('../config/connect_database.config');
const File = require('./file.model');
const PostFile = require('./post_file.model');
const Comment = require('./comment.model');
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
Post.hasMany(PostFile, {foreignKey: 'post_id', as: 'post_files'});
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments'});

module.exports = Post;