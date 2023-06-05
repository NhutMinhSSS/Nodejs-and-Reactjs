const express = require('express');
const router = express.Router();
const responseMiddleware = require('../middlewares/response_middleware');
const authenticateToken = require('../middlewares/authenticate_middleware');
const LoginController = require('../controllers/login.controller');
const QuestionCategoryService = require('../services/question_category.service');



router.use(express.json());
router.use(responseMiddleware);

router.get('/', (req, res) => {
    res.send('Start');
});

router.post('/login', LoginController.login);

router.post('/create', (req, res) => {
  QuestionCategoryService.addQuestionCategory(req.body.name).then(() => res.send('Success')).catch((error) => { 
    return res.status(500).send(error.name) });
}); 
module.exports = router;
