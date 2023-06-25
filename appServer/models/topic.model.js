const {DataTypes, Model } = require('sequelize');

const db = require('../config/connect_database.config');
const sequelize = db.getPool();

class Topic extends Model{}

Topic.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    topic_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    topic_order: {
        type: DataTypes.SMALLINT,
        allowNull: true
    },
    classroom_id: {
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
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Topic;