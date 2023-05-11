const { DataTypes, DATE, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class Post extends Model{}

Post.init({}, {
    sequelize,
    modelName: 'Posts',
    tableName: 'posts',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = Post;