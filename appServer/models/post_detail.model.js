const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database.config');
const sequelize = db.getPool();

class PostDetail extends Model{}
PostDetail.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'posts',
            key: 'id'
        }
    },
    finish_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    inverted_question: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    inverted_answer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
}, {
    sequelize,
    modelName: 'PostDetail',
    tableName: 'post_details',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = PostDetail;