const {DataTypes, Model} = require('sequelize');

const db = require('../config/connect_database.config');
const sequelize = db.getPool();

class StudentList extends Model{}

StudentList.init({
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
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'students',
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
    modelName: 'StudentList',
    tableName: 'student_lists',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at',
    indexes: [
        {
            fields: ['classroom_id', 'student_id']
        }
    ]
});

module.exports = StudentList;