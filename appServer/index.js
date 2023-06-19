const express = require('express');
const db = require('./config/connect_database.config');
const routes = require('./routes/routes');
const logger = require('./config/logger.config');
const SystemConst = require('./common/consts/system_const');
const EnumServerDefinitions = require('./common/enums/enum_server_definitions');
const customCorsOptions = require('./config/custom_cors_options.config');
const app = express();
//const http = require('http').Server(app);
//const io = require('socket.io')(http);

const port = SystemConst.PORT;
const domain = SystemConst.DOMAIN;

//global._io = io;
// Sử dụng middleware cors
app.use(customCorsOptions);
app.use('/api', routes);
const start = async () => {
    try {
        await db.connectDatabase();
        app.listen(port, domain, async () => {
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