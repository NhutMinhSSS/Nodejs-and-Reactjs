const logger = require('./logger');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

class Database {
    constructor() {
        this.sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
            dialect: process.env.DIALECT,
            host: process.env.DB_HOST,
            // port: process.env.PORT,
            pool: {
                max: 10, // số connection tối đa trong pool
                min: 0, // số connection tối thiểu trong pool
                acquire: 30000, // thời gian tối đa để lấy được một connection từ pool (đơn vị là milliseconds)
                idle: 10000 // thời gian tối đa một connection có thể ở trong pool mà không được sử dụng (đơn vị là milliseconds)
            },
            dialectOptions: {
                options: {
                    encrypt: true,
                },
            },
            logging: (msg) => logger.info(msg)
        });
        this.pool = this.sequelize;
    }
    async connectDatabase() {
        try {
            await this.sequelize.authenticate();
        } catch (error) {
            logger.error(error);
            //throw error
            throw new Error('Unable to connect database');
        }
    }
    getPool() {
        return this.pool;
    }
}
module.exports = new Database;