const {DataTypes, Model}= require('sequelize');

const db = require('../config/connect_database.config');
const Teacher = require('./teacher.model');
const Classroom = require('./classroom.model');
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

Teacher.belongsToMany(Classroom, { through: 'teacher_lists', foreignKey: 'teacher_id', otherKey: 'classroom_id' });
Classroom.belongsToMany(Teacher, { through: 'teacher_lists', foreignKey: 'classroom_id', otherKey: 'teacher_id'});

module.exports = TeacherList;