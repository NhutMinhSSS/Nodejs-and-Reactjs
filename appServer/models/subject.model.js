const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class Subject extends Model{}

Subject.init({}, {
    sequelize,
    modelName: 'Subject',
    tableName: 'subjects',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = Subject;