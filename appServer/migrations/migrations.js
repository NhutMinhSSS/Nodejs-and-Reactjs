const logger = require('../config/logger.config');
const Faculty = require('../models/faculty.model');
const PostCategory = require('../models/post_category.model');
const QuestionCategory = require('../models/question_category.mode');
const Account = require('../models/account.model');
const Department = require('../models/department.model');
const Subject = require('../models/subject.model');
const RegularClass = require('../models/regular_class.model');
const Classroom = require('../models/class_room.model');
const File = require('../models/file.model');
const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const StudentList = require('../models/student_list.model');
const TeacherList = require('../models/teacher_list.model');
const Topic = require('../models/topic.model');
const Post = require('../models/post.model');
const ForgotPassword = require('../models/forgot_password.model');
const PostFile = require('../models/post_file.model');
const Question = require('../models/question.model');
const Answer = require('../models/answer.model');
const StudentExam = require('../models/student_exam.model');
const StudentAnswerOption = require('../models/student_answer_option.model');
const StudentFileSubmission = require('../models/student_file_submission.model');
const StudentRandomizedQuestionList = require('../models/student_randomized_question_list.model');

(async() => {
    try {
        await Faculty.sync();
        await PostCategory.sync();
        await QuestionCategory.sync();
        await Account.sync();
        await Department.sync();
        await Subject.sync();
        await RegularClass.sync();
        await Classroom.sync();
        await File.sync();
        await Student.sync();
        await Teacher.sync();
        await StudentList.sync();
        await TeacherList.sync();
        await Topic.sync();
        await Post.sync();
        await ForgotPassword.sync();
        await PostFile.sync();
        await Question.sync();
        await Answer.sync();
        await StudentExam.sync();
        await StudentAnswerOption.sync();
        await StudentFileSubmission.sync();
        await StudentRandomizedQuestionList.sync();
        console.log("Bảng đã được tạo thành công!");
    } catch (error) {
        logger.error(error);
        console.log('Không thể tạo được bảng');
    }
})();
