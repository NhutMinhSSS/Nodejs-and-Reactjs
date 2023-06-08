const express = require('express');
const router = express.Router();
const responseMiddleware = require('../middlewares/response_middleware');
const authenticateToken = require('../middlewares/authenticate_middleware');
const LoginController = require('../controllers/login.controller');
const ClassroomController = require('../controllers/classroom.controller');
const postService = require('../services/post_services/post.service');



router.use(express.json());
router.use(responseMiddleware);

router.get('/', (req, res) => {
    res.send('Start');
});

router.post('/login', LoginController.login);
router.post('/create-class', ClassroomController.createClassroom);

router.get('/classroom', async(req, res) => {
    const a = await postService.findPostsByClassroomIdAndAccountId(1,1);
    return res.json(a);
})
module.exports = router;
