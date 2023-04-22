const express = require('express');
const db = require('./common/utils/connect_database');
const routes = require('./routes/routes');
const systemConst = require('./common/consts/system_const')
const app = express();

const port = systemConst.PORT

app.use('/api', routes);
const start = async () => {
    try {
        await db.connectDatabase();
        app.listen(port, () => {
            console.log(`Example app listening on port: ${port}`);
        });
    }
    catch (error) {
        console.log(error.message);
    }
};
start();