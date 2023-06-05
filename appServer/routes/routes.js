const express = require('express');
const router = express.Router();
const responseMiddleware = require('../middlewares/response_middleware');
const authenticateToken = require('../middlewares/authenticate_middleware');
const LoginController = require('../controllers/login.controller');
const QuestionCategoryService = require('../services/question_category.service');
const ClassroomController = require('../controllers/class_room.controller');



router.use(express.json());
router.use(responseMiddleware);

router.get('/', (req, res) => {
    res.send('Start');
});

router.post('/login', LoginController.login);
router.post('/create-class', ClassroomController.createClassroom);
module.exports = router;
