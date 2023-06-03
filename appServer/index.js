const express = require('express');
const cors = require('cors');
const db = require('./config/connect_database.config');
const routes = require('./routes/routes');
const logger = require('./config/logger.config');
const SystemConst = require('./common/consts/system_const');
const EnumServerDefinitions = require('./common/enums/enum_server_definitions');
const app = express();

const port = SystemConst.PORT;
const domain = SystemConst.DOMAIN;

// Sử dụng middleware cors
app.use(cors());
app.use('/api', routes);
const start = async () => {
    try {
        await db.connectDatabase();
       app.listen(port, domain,async() => {
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