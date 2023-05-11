const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class ClassRoom extends Model{}

ClassRoom.init({}, {
    sequelize,
    modelName: 'ClassRoom',
    tableName: 'classRooms',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = ClassRoom;