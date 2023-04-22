const express = require('express');
const router = express.Router();
const getController = require('../app/controllers/controller');

router.use(express.json());

router.get('/', (req,res) => {
    res.send('Start')
});
router.post('/send', getController.request);

router.get('/get-accounts', getController.selectQuery);
module.exports = router;