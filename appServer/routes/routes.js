const express = require('express');
const router = express.Router();
const responseMiddleware = require('../middlewares/response.middleware');
const authenticateToken = require('../middlewares/authenticate.middleware');
const LoginController = require('../controllers/login.controller');
const classroomRouter = require('./classroom.route');
const postRouter = require('./post.route');
const UserManager = require('../controllers/user_manager.controller');



router.use(express.json());
router.use(responseMiddleware);

router.get('/', (req, res) => {
    res.send('Start');
});

router.post('/login', LoginController.login);
router.get('/create', async(res) => {
    let req;
    req.body = {
        email: '',
        password: '',
        role: 1,
        studentCode: '0306201050',
        firstName: 'Minh',
        lastName: 'Lê Dương Nhựt',
        dateOfBirth: '2023-10-11',
        gender: 1,
        phoneNumber: '0399313240',
        CCCD: '18475869586',
        address: 'Bến Tre'
    }
    const success = await UserManager.addStudentOrTeacher(req);
    if (success) {
        return res.json('success');
    }
});
router.use('/classrooms', /* authenticateToken, */ classroomRouter);
router.use('/posts', /* authenticateToken, */ postRouter);
//post check detail, edit, delete, send exam
module.exports = router;
