const express = require('express');
const router = express.Router();
const responseMiddleware = require('../middlewares/response.middleware');
const authenticateToken = require('../middlewares/authenticate.middleware');
const LoginController = require('../controllers/login.controller');
const classroomRouter = require('./users/classroom.route');
const postRouter = require('./users/post.route');
const AdminRouter = require('./admin/admin.route');
const FileRouter = require('./users/file.route');
const QuestionRouter = require('./users/question.router');
const StudentRouter = require('./users/student.route');


router.use(express.json());
router.use(responseMiddleware);
router.get('/', (req, res) => {
    res.send('Start');
});

router.post('/login', LoginController.login);
router.use('/admin', authenticateToken, AdminRouter);
router.use('/classrooms', authenticateToken, classroomRouter);
router.use('/posts', authenticateToken, postRouter);
router.use('/files', authenticateToken, FileRouter);
router.use('/questions-and-answers', authenticateToken, QuestionRouter);
router.use('/students', authenticateToken, StudentRouter)

router.get('/test', (req, res) => {
    const questions = [
        {
          id: 1,
          content: 'Đâu là thủ đô của Việt Nam?',
          score: 10,
          question_category_id: 1,
          answers: [
            { id: 3,question_id: 1, answer: 'Hà Nội', correct_answer: true},
            { id: 4,question_id: 1, answer: 'Hồ Chí Minh', correct_answer: false },
            { id: 5,question_id: 1, answer: 'Đà Nẵng', correct_answer: false }
          ],
          student_answer_options: [
            { question_id: 1, answer_id: 1, essay_answer: null, student_exam_id: 1 },
          ]
        },
        {
          id: 2,
          content: 'Ai là người đầu tiên đặt chân lên mặt trăng?',
          score: 10,
          question_category_id: 1,
          answers: [
            { id: 6, answer: 'Neil Armstrong', correct_answer: true },
            { id: 7, answer: 'Buzz Aldrin', correct_answer: false },
            { id: 8, answer: 'Michael Collins', correct_answer: false }
          ],
          student_answer_options: [
            { question_id: 2, answer_id: 6, essay_answer: null, student_exam_id: 1 }
          ]
        },
        {
          id: 3,
          content: 'Ai là vị tướng lừng danh trong lịch sử Việt Nam?',
          score: 10,
          question_category_id: 1,
          answers: [
            { id: 9, answer: 'Võ Nguyên Giáp', correct_answer: true },
            { id: 10, answer: 'Trần Hưng Đạo', correct_answer: false },
            { id: 11, answer: 'Lê Lợi', correct_answer: false }
          ],
          student_answer_options: [
            { question_id: 3, answer_id: 9, essay_answer: null, student_exam_id: 1 }
          ]
        },
        {
          id: 4,
            content: "Tình yêu là gì?",
            score: 10,
            question_category_id: 2,
            answers: [
              { id: 12, answer: "Một cảm giác mạnh mẽ và tình cảm sâu sắc dành cho người khác", correct_answer: true },
              { id: 13, answer: "Một loại bệnh", correct_answer: false },
              { id: 14, answer: "Một trạng thái của tâm hồn", correct_answer: true },
              { id: 15, answer: "Sự hợp tác và chia sẻ giữa hai người", correct_answer: false }
            ],
            student_answer_options: [
              { question_id: 4, answer_id: 14, essay_answer: null, student_exam_id: 1 },
              { question_id: 4, answer_id: 15, essay_answer: null, student_exam_id: 1 }
            ]
          },
          {
            id: 5,
            content: "Tình yêu có thể đến bất ngờ ở đâu?",
            score: 10,
            question_category_id: 2,
            answers: [
              { id: 16, answer: "Trong một buổi hẹn đầu tiên", correct_answer: false },
              { id: 17, answer: "Ở nơi làm việc", correct_answer: true },
              { id: 18, answer: "Trên mạng xã hội", correct_answer: true },
              { id: 19, answer: "Chỉ trong tiểu thuyết và phim ảnh", correct_answer: false }
            ],
            student_answer_options: [
              { question_id: 5, answer_id: 17, essay_answer: null, student_exam_id: 1 },
              { question_id: 5, answer_id: 19, essay_answer: null, student_exam_id: 1 }
            ]
          },
          {
            id: 6,
            content: "Tình yêu có thể tồn tại trong thời gian dài không?",
            score: 10,
            question_category_id: 3,
            answers: [],
            student_answer_options: [
              { question_id: 6, answer_id: null, essay_answer: 'Tình yêu có thể tồn tại trong thời gian dài nếu được xây dựng trên cơ sở của sự hiểu biết, tôn trọng, lòng tin và cống hiến. Một mối quan hệ tình yêu bền vững yêu cầu cả hai bên cùng đồng ý và làm việc với nhau để duy trì và phát triển tình yêu qua thời gian.'+

              'Để tình yêu tồn tại lâu dài, cần có sự chăm sóc và quan tâm đến nhau. Hai người cần dành thời gian để hiểu và chia sẻ với nhau, xây dựng sự gắn kết và tạo nên một môi trường ủng hộ và an lành cho mối quan hệ. Đồng thời, việc tôn trọng và tin tưởng lẫn nhau cũng rất quan trọng. Tình yêu cần được xây dựng trên nền tảng của sự chung thuỷ, trung thực và tôn trọng giữa hai người.'+
              
              'Tuy nhiên, để tình yêu tồn tại lâu dài, cũng cần phải thích nghi và điều chỉnh trong quá trình hình thành và phát triển. Cuộc sống và môi trường xung quanh có thể thay đổi, và cả hai người trong mối quan hệ cần hỗ trợ và thích nghi với những thay đổi đó. Quan trọng nhất là sẵn lòng làm việc với nhau để vượt qua khó khăn và tạo nên sự cân bằng và hạnh phúc trong mối quan hệ.'+
              
              'Tình yêu có thể tồn tại trong thời gian dài nếu cả hai người trong mối quan hệ cam kết và làm việc với nhau để nuôi dưỡng và phát triển tình yêu đó. Nó có thể trở nên sâu sắc và mãnh liệt hơn qua thời gian và đem lại hạnh phúc và sự an lành cho cả hai người.', student_exam_id: 1},
            ]
          }
          
        // Các câu hỏi khác...
      ];
    
    const randomQuestions = questions.sort(() => Math.random() - 0.5).map(question => {
      const answersRandom = question.answers.sort(() => Math.random() - 0.5);

      return {...question, answers: answersRandom}
    });
    return res.json(randomQuestions);
});
//post check detail, edit, delete, send exam
module.exports = router;
