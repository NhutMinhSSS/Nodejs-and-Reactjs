const express = require('express');
const router = express.Router();
const responseMiddleware = require('../middlewares/response.middleware');
const authenticateToken = require('../middlewares/authenticate.middleware');
const LoginController = require('../controllers/login.controller');
const classroomRouter = require('./users/classroom.route');
const postRouter = require('./users/post.route');
const AdminRouter = require('./admin/admin.route');



router.use(express.json());
router.use(responseMiddleware);

router.get('/', (req, res) => {
    res.send('Start');
});

router.post('/login', LoginController.login);
router.use('/admin', authenticateToken, AdminRouter);
router.use('/classrooms', authenticateToken, classroomRouter);
router.use('/posts', authenticateToken, postRouter);

router.get('/test', (req, res) => {
    const questions = [
        {
            content: 'Câu hỏi 1',
            exam_id: 1,
            score: 10,
            question_category_id: 2,
            answers: [
                { id: 3, content: 'Đáp án 1.1', isCorrect: true },
                { id: 4, content: 'Đáp án 1.2', isCorrect: true },
                { id: 5, content: 'Đáp án 1.3', isCorrect: false }
            ],
            student_exam: [
                { id: 1, answer_id: 3 },
                { id: 2, answer_id: 5 }
            ]
        },
        {
            content: 'Câu hỏi 2',
            score: 10,
            exam_id: 1,
            question_category_id: 1,
            answers: [
                { id: 6, content: 'Đáp án 2.1', isCorrect: true },
                { id: 7, content: 'Đáp án 2.2', isCorrect: false },
                { id: 8, content: 'Đáp án 2.3', isCorrect: false }
            ],
            student_exam: [
                { id: 3, answer_id: 6 }
            ]
        },
        {
            content: 'Câu hỏi 3',
            score: 10,
            exam_id: 1,
            question_category_id: 1,
            answers: [
                { id: 9, content: 'Đáp án 3.1', isCorrect: true },
                { id: 10, content: 'Đáp án 3.2', isCorrect: false },
                { id: 11, content: 'Đáp án 3.3', isCorrect: false }
            ],
            student_exam: [
                { id: 4, answer_id: 11 }
            ]
        }
    ]
    //   let totalScore = 0; // Biến tích lũy tổng điểm
      
    //   questions.forEach(itemQ => {
    //     const questionScore = itemQ.score; // Điểm của câu hỏi
    //     totalScore += questionScore; // Cộng điểm của câu hỏi vào tổng điểm
    //   });
      
    //   let finalScore = 0; // Điểm cuối cùng
      
    //   questions.forEach(itemQ => {
    //     const cau_dung = itemQ.answers.filter(item => item.isCorrect).length;
    //     const dung = itemQ.answers.reduce((total, itemA) => {
    //       const isChosen = itemQ.student_exam.some(item => item.answer_id === itemA.id);
    //       return total + (itemA.isCorrect && isChosen ? 1 : 0);
    //     }, 0);
      
    //     const questionScore = itemQ.score; // Điểm của câu hỏi
    //     finalScore += (dung / cau_dung) * questionScore; // Cộng điểm của câu hỏi vào điểm cuối cùng
    //   });
      
    //   finalScore = (finalScore / totalScore) * 100; // Tính điểm cuối cùng bằng số điểm trả lời đúng nhân với 100 và chia cho tổng điểm của tất cả câu hỏi
      
    //   console.log('Điểm cuối cùng:', finalScore);
      
    // //totalscore điểm * 100 / tổng điểm
    // console.log(score);
    return res.json(questions);
});
//post check detail, edit, delete, send exam
module.exports = router;
