const express = require('express');
const router = express.Router();
const getController = require('../controllers/controller');
const responseMiddleware = require('../middlewares/response_middleware');
const authenticateToken = require('../middlewares/authenticate_middleware');


router.use(express.json());
router.use(responseMiddleware);

router.get('/', (req, res) => {
  res.send('Start')
});
router.post('/send', getController.request);

router.get('/get-accounts', authenticateToken, getController.selectQuery);

module.exports = router;