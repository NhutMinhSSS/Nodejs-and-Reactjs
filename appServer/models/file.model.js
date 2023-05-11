const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class File extends Model{}

File.init({}, {
    sequelize,
    modelName: 'File',
    tableName: 'files',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = File;