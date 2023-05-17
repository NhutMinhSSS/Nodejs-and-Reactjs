const db = require('../config/connect_database');
const logger = require('../config/logger');
// const pool = db.getPool();
const Accounts = require('../models/account.model');
class GetController {
    request(req, res) {
        let data = req.body.name;
        res.send(data);
    };
    async selectQuery(req, res) {
        try{
            const result = await Accounts.findAll();
            // let json_data = {
            //     "message": "Success",
            //     "data": result
            // };
            res.json(result)
        } catch (error) {
            logger.error(error);
            // res.status(500).send("Internal Server Error");
        }
    }
}
module.exports = new GetController;


