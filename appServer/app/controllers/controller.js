const db = require('../../common/utils/connect_database');
const pool = db.getPool();
class GetController {
    request(req, res) {
        let data = req.body.name;
        res.send(data);
    };
    selectQuery(req, res) {
        pool.query('select * from accounts').then(
            (result) => res.send(result[0])
        ).catch(() => {
            console.error('Lỗi không truy xuất được database');
        });
    }
}
module.exports = new GetController;