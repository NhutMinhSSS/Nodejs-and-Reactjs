const SystemConst = require("../common/consts/system_const");
const fs = require('fs-extra');
const EnumMessage = require("../common/enums/enum_message");
const CommonService = require("../common/utils/common_service");
const ServerResponse = require("../common/utils/server_response");
const logger = require("../config/logger.config");
const PostService = require("../services/post_services/post.service");
const db = require("../config/connect_database.config");
const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const PostDetailService = require("../services/post_services/post_detail.service");
const FileService = require("../services/file_service/file.service");
const PostFileService = require("../services/post_services/post_file.service");
const ClassroomStudentService = require("../services/classroom_services/classroom_student.service");
const StudentExamService = require("../services/student_services/student_exam.service");
const sequelize = db.getPool();

class PostController {
    //Show posts 
    async showPostsByUser(req, res) {
        try {
            // const accountId = req.user.account_id;
            // const classroomId = req.params.classroom_id;
            // const role = req.user.role;
            let user;
            // if (role === EnumServerDefinitions.ROLE.STUDENT) {
            //     user = await StudentService.findStudentByAccountId(accountId);   
            // }
            const listPost = await PostService.findPostsByClassroomIdAndAccountId(1);
            const data = {
                list_post: listPost
            }
            let postDeadlines; // Di chuyển khai báo biến ra khỏi khối if
            if (listPost.length > 0) {
                const posts = listPost.filter(item => item.category !== "Bảng tin" && CommonService.checkPostsDeadline(item.finish_date));
                postDeadlines = posts.map(post => ({
                    id: post.id,
                    title: post.title
                }));
                data.exam_deadline = postDeadlines;
            }
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, data);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER, EnumMessage.DEFAULT_ERROR);
        }
    }
    //get post detail
    async getPostDetail(req, res) {
        try {
            const postId = req.params.post_id;
            const role = req.user.role;
            const studentId = req.student_id || null;
            const postDetail = await PostService.getDetailPost(postId, studentId);
            if (role === EnumServerDefinitions.ROLE.TEACHER) {
                const { delivered, submitted } = student_exams.reduce((counts, exam) => {
                    if (exam.submission === EnumServerDefinitions.SUBMISSION.UNSENT) {
                      counts.delivered++;
                    } else {
                      counts.submitted++;
                    }
                    return counts;
                  }, { delivered: 0, submitted: 0 });
                  postDetail.delivered = delivered;
                  postDetail.submitted = submitted;
            }
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS, postDetail);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    //Create Post
    async createPost(req, res) {
        const transaction = await sequelize.transaction();
        const files = req.files || [];
        try {
            const accountId = req.user.account_id;
            const role = req.user.role;
            const title = req.body.title;
            const content = req.body.content || null;
            const classroomId = req.body.classroom_id;
            const topicId = req.body.topic_id || null;
            const startDate = req.body.start_date || null;//moment().tz(SystemConst.TIME_ZONE).format();
            const finishDate = req.body.finish_date || null;
            const invertedQuestion = req.body.inverted_question || 0;
            const invertedAnswer = req.body.inverted_answer || 0;
            const isPublic = req.body.is_public || false;
            const postCategoryId = req.body.post_category_id;
            if (postCategoryId !== EnumServerDefinitions.POST_CATEGORY.NEWS && role !== EnumServerDefinitions.ROLE.TEACHER) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST,
                    EnumMessage.NO_PERMISSION)
            }
            const newPost = await PostService.createPost(title, content, postCategoryId, accountId, classroomId, topicId, transaction);
            if (postCategoryId !== EnumServerDefinitions.POST_CATEGORY.NEWS) {
                //PostDetail
                const newPostDetail = await PostDetailService.createPostDetail(newPost.id, startDate, finishDate, invertedQuestion, invertedAnswer, isPublic, transaction);
                //student exam
                let studentIds
                if (newPostDetail.is_public) {
                    const listStudents = await ClassroomStudentService.findStudentsByClassroomId(classroomId);
                    studentIds = listStudents.map(item => item.student_id);
                } else {
                    const listStudents = req.body.list_student || [];
                    studentIds = listStudents.map(item => item.id);
                }
                await StudentExamService.addStudentExams(newPost.id, studentIds, transaction);
            }
            if (files.length > EnumServerDefinitions.EMPTY) {
                const listFiles = files.map(item => {
                    const data = fs.readFileSync(item.path);
                    const base64 = data.toString('base64');
                    return {
                        file_name: item.originalname,
                        physical_name: item.filename,
                        file_path: base64,
                        file_type: item.mimetype,
                        account_id: accountId,
                        file_data: item.size / SystemConst.KB
                    }
                }).filter(item => item !== null);;
                const listFileNew = await FileService.createFiles(listFiles, transaction);
                const fileIds = listFileNew.map(item => item.id);
                await PostFileService.addPostFiles(newPost.id, fileIds, transaction);
            }
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
        } catch (error) {
            await transaction.rollback();
            logger.error(error);
           if (req.directoryPath) {
               fs.removeSync(req.directoryPath);
           }
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
}

module.exports = new PostController;
