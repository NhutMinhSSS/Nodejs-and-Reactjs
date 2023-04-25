const db = require('../config/connect_database');
// const pool = db.getPool();
const accounts = require('../models/Account');
class GetController {
    request(req, res) {
        let data = req.body.name;
        res.send(data);
    };
    selectQuery(req, res) {
        accounts.findAll().then((result) => {
            let json_data = {
                "message": "Success",
                "data": result
            }
            res.send(json_data)
        }).catch((error) =>{

            console.error(error)
        });
    }
}
module.exports = new GetController;


