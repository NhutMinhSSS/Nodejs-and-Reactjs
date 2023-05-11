const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class Faculty extends Model{}

Faculty.init({}, {
    sequelize,
    modelName: 'Faculty',
    tableName: 'faculties',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = Faculty;