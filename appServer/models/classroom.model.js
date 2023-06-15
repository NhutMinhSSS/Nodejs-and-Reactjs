const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database.config');
const sequelize = db.getPool();

class Classroom extends Model{}

Classroom.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    class_code:{
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    class_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    create_date: {
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
    regular_class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'regular_class',
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
    subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'subjects',
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
    modelName: 'Classroom',
    tableName: 'classrooms',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at',
    indexes: [
        {
            unique: true,
            fields: ['class_code']
        }
    ]
});

module.exports = Classroom;