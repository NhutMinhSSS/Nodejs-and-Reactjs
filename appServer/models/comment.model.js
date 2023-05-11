const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class Comment extends Model{}

Comment.init({},{
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = Comment;