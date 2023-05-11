const express = require('express');
const db = require('./config/connect_database');
const routes = require('./routes/routes');
const logger = require('./config/logger');
const SystemConst = require('./common/consts/system_const');
const EnumServerDefinitions = require('./common/enums/enum_server_definitions');
const app = express();

const port = SystemConst.PORT;
const domain = SystemConst.DOMAIN;


app.use('/api', routes);
const start = async () => {
    try {
        await db.connectDatabase();
       app.listen(port, async() => {
            logger.info(`Example app listening on port: ${port}`);
        }).on(EnumServerDefinitions.ERROR, (error) => {
            logger.error(`Failed to start server: ${error}`);
            console.log(error.message);
        });
    }
    catch (error) {
        logger.error(error);
    }
};
start();