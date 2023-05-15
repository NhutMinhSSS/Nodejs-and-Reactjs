const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database');
const { IGNORE } = require('sequelize/types/index-hints');
const sequelize = db.getPool();

class ClassRoom extends Model{}

ClassRoom.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    className: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    note: {
        type: DataTypes.STRING,
        allowNull: true
    },
    regularClassId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'regularClass',
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
    modelName: 'ClassRoom',
    tableName: 'classRooms',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = ClassRoom;