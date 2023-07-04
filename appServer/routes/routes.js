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
          content: 'Đâu là thủ đô của Việt Nam?',
          exam_id: 1,
          score: 10,
          question_category_id: 1,
          answers: [
            { id: 3, content: 'Hà Nội', isCorrect: true },
            { id: 4, content: 'Hồ Chí Minh', isCorrect: false },
            { id: 5, content: 'Đà Nẵng', isCorrect: false }
          ],
          student_exam: [
            { id: 1, answer_id: 3 },
            { id: 2, answer_id: 4 }
          ]
        },
        {
          content: 'Ai là người đầu tiên đặt chân lên mặt trăng?',
          exam_id: 1,
          score: 10,
          question_category_id: 1,
          answers: [
            { id: 6, content: 'Neil Armstrong', isCorrect: true },
            { id: 7, content: 'Buzz Aldrin', isCorrect: false },
            { id: 8, content: 'Michael Collins', isCorrect: false }
          ],
          student_exam: [
            { id: 3, answer_id: 6 }
          ]
        },
        {
          content: 'Ai là vị tướng lừng danh trong lịch sử Việt Nam?',
          exam_id: 1,
          score: 10,
          question_category_id: 1,
          answers: [
            { id: 9, content: 'Võ Nguyên Giáp', isCorrect: true },
            { id: 10, content: 'Trần Hưng Đạo', isCorrect: false },
            { id: 11, content: 'Lê Lợi', isCorrect: false }
          ],
          student_exam: [
            { id: 4, answer_id: 9 }
          ]
        },
        {
            content: "Tình yêu là gì?",
            exam_id: 1,
            score: 10,
            question_category_id: 2,
            answers: [
              { id: 12, "content": "Một cảm giác mạnh mẽ và tình cảm sâu sắc dành cho người khác", "isCorrect": true },
              { id: 13, "content": "Một loại bệnh", "isCorrect": false },
              { id: 14, "content": "Một trạng thái của tâm hồn", "isCorrect": true },
              { id: 15, "content": "Sự hợp tác và chia sẻ giữa hai người", "isCorrect": false }
            ],
            student_exam: [
              { id: 3, "answer_id": 14 },
              { id: 4, "answer_id": 15 }
            ]
          },
          {
            content: "Tình yêu có thể đến bất ngờ ở đâu?",
            exam_id: 1,
            score: 10,
            question_category_id: 2,
            answers: [
              { id: 16, "content": "Trong một buổi hẹn đầu tiên", "isCorrect": false },
              { id: 17, "content": "Ở nơi làm việc", "isCorrect": true },
              { id: 18, "content": "Trên mạng xã hội", "isCorrect": true },
              { id: 19, "content": "Chỉ trong tiểu thuyết và phim ảnh", "isCorrect": false }
            ],
            student_exam: [
              { id: 5, "answer_id": 17 },
              { id: 6, "answer_id": 19 }
            ]
          },
          {
            content: "Tình yêu có thể tồn tại trong thời gian dài không?",
            exam_id: 1,
            score: 10,
            question_category_id: 3,
            student_exam: [
              { id: 7, "answer_id": 'Yêu em nhiều hahahah' },
            ]
          }
          
        // Các câu hỏi khác...
      ];
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
