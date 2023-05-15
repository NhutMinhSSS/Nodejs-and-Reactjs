const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class PostCategory extends Model{}

PostCategory.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.SMALLINT,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'PostCategory',
    tableName: 'postCategories',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = PostCategory;