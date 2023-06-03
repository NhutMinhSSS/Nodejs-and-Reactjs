const express = require('express');
const router = express.Router();
const getController = require('../controllers/controller');
const responseMiddleware = require('../middlewares/response_middleware');
const authenticateToken = require('../middlewares/authenticate_middleware');
const LoginController = require('../controllers/login.controller');
const AccountService = require('../services/account.service');

router.use(express.json());
router.use(responseMiddleware);

router.get('/', (req, res) => {
  res.send('Start')
});

router.post('/login', LoginController.login);

module.exports = router;