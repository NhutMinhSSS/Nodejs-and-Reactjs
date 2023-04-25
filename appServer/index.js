const express = require('express');
const db = require('./config/connect_database');
const routes = require('./routes/routes');
const logger = require('./config/logger');
const systemConst = require('./common/consts/system_const');
const app = express();

const port = systemConst.PORT;
const domain = systemConst.DOMAIN;


app.use('/api', routes);
const start = async () => {
    try {
        await db.connectDatabase();
        app.listen(port, domain, async() => {
            logger.info(`Example app listening on port: ${port}`);
        });
    }
    catch (error) {
        logger.error(error);
        console.log(error.message);
    }
};
start();