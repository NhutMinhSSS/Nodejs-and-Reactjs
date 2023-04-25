const express = require('express');
const router = express.Router();
const getController = require('../controllers/controller');
const logger = require('../config/logger');

router.use(express.json());
router.use((req, res, next) => {
    logger.info(`${req.ip} - [${req.method}] ${req.originalUrl} - ${res.statusCode}`);
    next();
  });

router.get('/', (req,res) => {
    res.send('Start')
});
router.post('/send', getController.request);

router.get('/get-accounts', getController.selectQuery);
module.exports = router;