const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.use(express.json());

router.get('/api', (req,res) => {
    res.send('Start')
});
router.post('/api/send', controller.request);

module.exports = router;