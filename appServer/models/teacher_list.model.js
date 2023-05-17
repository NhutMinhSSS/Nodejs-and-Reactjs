const {DataTypes, Model}= require('sequelize');

const db = require('../config/connect_database');
const sequelize = db.getPool();

class TeacherList extends Model{}

TeacherList.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    classroom_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'classrooms',
            key: 'id'
        }
    },
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'teachers',
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
    modelName: 'TeacherList',
    tableName: 'teacher_lists',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at',
    indexes: [
        {
            fields: ['classroom_id', 'teacher_id']
        }
    ]
});

module.exports = TeacherList;