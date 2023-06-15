const express = require('express');
const router = express.Router();
const responseMiddleware = require('../middlewares/response.middleware');
const authenticateToken = require('../middlewares/authenticate.middleware');
const LoginController = require('../controllers/login.controller');
const classroomRouter = require('./classroom.route');
const postRouter = require('./post.route');



router.use(express.json());
router.use(responseMiddleware);

router.get('/', (req, res) => {
    res.send('Start');
});

router.post('/login', LoginController.login);
router.use('/classrooms', /* authenticateToken, */ classroomRouter);
router.use('/posts', /* authenticateToken, */ postRouter);
//post check detail, edit, delete, send exam
module.exports = router;
