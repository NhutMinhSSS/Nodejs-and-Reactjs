const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class File extends Model{}

File.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    physicalName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    createDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileType: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accountClassrooms',
            key: 'id'
        }
    },
    fileData: {
        type: DataTypes.FLOAT(10),
        allowNull: false
    },
    status: {
        type: DataTypes.SMALLINT,
        defaultValue: 1,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'File',
    tableName: 'files',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = File;