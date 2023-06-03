const {DataTypes, DATE, Model} = require('sequelize');

const db = require('../config/connect_database.config');
const sequelize = db.getPool();

class PostFile extends Model{}

PostFile.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    file_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'files',
            key: 'id'
        }
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'posts',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'PostFile',
    tableName: 'post_files',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = PostFile;