const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT,
    port: process.env.PORT,
    dialectOptions: {
        options: {
            encrypt: true,
        },
    }
});

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
    } catch (error) {
        throw new Error('Unable to connect database')
    }
};
module.exports = connectDatabase;