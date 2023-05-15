const { DataTypes, Model } = require("sequelize");

const db = require("../config/connect_database");
const sequelize = db.getPool(); 

class AccountClassroom extends Model {}
AccountClassroom.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
        allowNull: false
    },
    status: {
        type: DataTypes.SMALLINT,
        defaultValue: 1,
        allowNull: false
    }
}, { sequelize,
    modelName: 'AccountClassroom',
    tableName: 'accountClassrooms',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'update_at'
});

module.exports = AccountClassroom;