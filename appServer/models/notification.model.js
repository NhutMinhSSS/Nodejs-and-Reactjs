const { DataTypes, Model } = require('sequelize');

const db = require('../config/connect_database.config');
const sequelize = db.getPool();
const Post = require('./post.model');
const Student = require('./student.model');

class Notification extends Model{}

Notification.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'students',
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
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    create_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Notification.belongsTo(Post, { foreignKey: 'post_id'});
Notification.belongsTo(Student, {foreignKey: 'student_id'});

module.exports = Notification;