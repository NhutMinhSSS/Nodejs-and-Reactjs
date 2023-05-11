const {DataTypes, DATE, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class PostFile extends Model{}

PostFile.init({}, {
    sequelize,
    modelName: 'PostFile',
    tableName: 'postFiles',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = PostFile;