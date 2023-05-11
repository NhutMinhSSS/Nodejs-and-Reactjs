const {DataTypes, Model } = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class Topic extends Model{}

Topic.init({}, {
    sequelize,
    modelName: 'Topic',
    tableName: 'topics',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = Topic;