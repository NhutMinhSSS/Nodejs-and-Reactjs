const express = require('express');
const app = express();

const connectDatabase = require('./common/utils/connect_database');
const routes = require('./routes/routes');


const port = 3000;
app.use('/', routes);
const start = async () => {
    try {
        //await connectDatabase()
        app.listen(port, () => {
            console.log(`Example app listening on port: ${port}`);
        })
    }
    catch (error) {
        console.log(error.message)
    }
};
start();








