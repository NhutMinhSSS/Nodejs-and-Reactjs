const {DataTypes, Model } = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class Topic extends Model{}

Topic.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    topicName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    topicOrder: {
        type: DataTypes.SMALLINT,
        allowNull: true
    },
    classRoomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'classRooms',
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
    modelName: 'Topic',
    tableName: 'topics',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = Topic;