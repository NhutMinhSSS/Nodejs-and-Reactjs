const { DataTypes, DATE, Model} = require('sequelize');

const db = require('../config/connect_database');
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
    createDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    postCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'postCategories',
            key: 'id'
        }
    },
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accountClassrooms',
            key: 'id'
        }
    },
    classRoomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'classRooms',
            key: 'id'
        }
    },
    topicId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'topics',
            key: 'id'
        }
    },
    finishDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    invertedQuestion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    InvertedAnswer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.SMALLINT,
        defaultValue: 1,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Posts',
    tableName: 'posts',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = Post;