const express = require('express');
const db = require('./config/connect_database.config');
const routes = require('./routes/routes');
const logger = require('./config/logger.config');
const SystemConst = require('./common/consts/system_const');
const EnumServerDefinitions = require('./common/enums/enum_server_definitions');
const customCorsOptions = require('./config/custom_cors_options.config');
const app = express();
//const http = require('http').Server(app);
const https = require('https');
const path = require('path');
const fs = require('fs');
//const socketIO = require('socket.io');
//const SocketService = require('./services/socket_services/socket.service');

// Cấu hình server HTTPS
const portHttps = SystemConst.PORT_HTTPS;
const domain = SystemConst.DOMAIN;

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'private.key')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'certificate.crt'))
  };
const httpsServer = https.createServer(httpsOptions, app);

// Khởi tạo socket.io và gắn nó với server HTTPS
//const io = socketIO(httpsServer);

//global._io = io;
// Sử dụng middleware cors
app.use(customCorsOptions);
app.use('/api', routes);
const start = async (server, port) => {
    try {
        await db.connectDatabase();
        server.listen(port, domain, async () => {
            logger.info(`Example app listening on port: ${port}`);
        }).on(EnumServerDefinitions.ERROR, (error) => {
            logger.error(`Failed to start server: ${error}`);
            console.log(error.message);
        });
        //global._io.on('connection', SocketService.connection);
    }
    catch (error) {
        logger.error(error);
        return;
    }
};
start(httpsServer, portHttps);