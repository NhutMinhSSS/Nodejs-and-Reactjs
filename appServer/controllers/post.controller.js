const SystemConst = require("../common/consts/system_const");
const fs = require('fs-extra');
const EnumMessage = require("../common/enums/enum_message");
const ServerResponse = require("../common/utils/server_response");
const logger = require("../config/logger.config");
const PostService = require("../services/post_services/post.service");
const db = require("../config/connect_database.config");
const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const PostDetailService = require("../services/post_services/post_detail.service");
const FileService = require("../services/file_service/file.service");
const PostFileService = require("../services/post_services/post_file.service");
const ClassroomStudentService = require("../services/classroom_services/classroom_student.service");
const StudentService = require("../services/student_services/student.service");
const StudentExamService = require("../services/student_services/student_exam.service");
const FormatUtils = require("../common/utils/format.utils");
const QuestionService = require("../services/question_services/question.service");
const sequelize = db.getPool();

class PostController {
    //Show posts 
    async showPostsByUser(req, res) {
        try {
            const accountId = req.user.account_id;
            //const classroomId = req.params.classroom_id;
            const role = req.user.role;
            const classroom = req.classroom;
            let user;
            if (role === EnumServerDefinitions.ROLE.STUDENT) {
                user = await StudentService.findStudentByAccountId(accountId);
            }
            const listPost = await PostService.findPostsByClassroomIdAndAccountId(classroom.id, user ? user.id : null);
            const data = {
                class_name: classroom.class_name,
                title: classroom.title,
                class_code: role === EnumServerDefinitions.ROLE.STUDENT ? null : classroom.class_code,
                list_post: listPost
            }
            let postDeadlines; // Di chuyển khai báo biến ra khỏi khối if
            if (listPost.length > 0) {
                const posts = listPost.filter(item => item.post_category_id !== EnumServerDefinitions.POST_CATEGORY.NEWS && FormatUtils.checkPostsDeadline(item.finish_date));
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
                const { delivered, submitted } = postDetail.student_exams.reduce((counts, exam) => {
                    if (exam.submission === EnumServerDefinitions.SUBMISSION.UNSENT) {
                        counts.delivered++;
                    } else {
                        counts.submitted++;
                    }
                    return counts;
                }, { delivered: 0, submitted: 0 });
                postDetail.delivered = delivered;
                postDetail.submitted = submitted;
            } else {
                postDetail.student_exams = postDetail.student_exams.map(item => {
                    if (item.submission !== EnumServerDefinitions.SUBMISSION.SUBMITTED) {
                      const { total_score, ...rest } = item; // Bỏ cột "total_score" khỏi đối tượng item
                      return rest;
                    } else {
                        return item;
                    }
                  });
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
        const accountId = req.user.account_id;
        const role = req.user.role;
        let title = req.body.title;
        const content = req.body.content || null;
        const classroomId = req.classroom.id;
        const topicId = req.body.topic_id;
        const postCategoryId = req.body.post_category_id;
        const postCategoryIdParseInt = parseInt(postCategoryId);
        if (postCategoryIdParseInt === EnumServerDefinitions.POST_CATEGORY.NEWS) {
            title = "Bảng tin";
            if (!content) {
                if (req.directoryPath) {
                    fs.removeSync(req.directoryPath);
                }
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.REQUIRED_INFORMATION);
            }
        }
        if (!postCategoryId || !title) {
            if (req.directoryPath) {
                fs.removeSync(req.directoryPath);
            }
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        if (postCategoryIdParseInt !== EnumServerDefinitions.POST_CATEGORY.NEWS && role !== EnumServerDefinitions.ROLE.TEACHER) {
            if (req.directoryPath) {
                fs.removeSync(req.directoryPath);
            }
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST,
                EnumMessage.NO_PERMISSION)
        }
        const files = req.files;
        const transaction = await sequelize.transaction();
        try {
            const newPost = await PostService.createPost(title, content, postCategoryIdParseInt, accountId, classroomId, topicId, transaction);
            if (postCategoryIdParseInt !== EnumServerDefinitions.POST_CATEGORY.NEWS) {
                const startDate = req.body.start_date;
                const finishDate = req.body.finish_date;
                const invertedQuestion = req.body.inverted_question || 0;
                const invertedAnswer = req.body.inverted_answer || 0;
                const isPublic = req.body.is_public || true;
                const isHidden = req.body.is_hidden || false;
                //PostDetail
                const newPostDetail = await PostDetailService.createPostDetail(newPost.id, startDate, finishDate, invertedQuestion, invertedAnswer, isPublic, isHidden, transaction);
                //student exam
                let studentIds
                if (newPostDetail.is_public) {
                    const listStudents = await ClassroomStudentService.findStudentsByClassroomId(classroomId);
                    studentIds = listStudents.map(item => item.student_id);
                } else {
                    const listStudents = req.body.list_student;
                    studentIds = listStudents.map(item => item.id);
                }
                const studentExams = studentIds.map(item => ({
                    exam_id: newPost.id,
                    student_id: item
                }))
                await StudentExamService.addStudentExams(studentExams, transaction);
                if (postCategoryIdParseInt === EnumServerDefinitions.POST_CATEGORY.EXAM) {
                    //create question
                    const listQuestionAndAnswers = req.body.list_questions_and_answers;
                    if (!listQuestionAndAnswers || listQuestionAndAnswers.length === EnumServerDefinitions.EMPTY) {
                        await transaction.rollback();
                        return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                            EnumMessage.REQUIRED_INFORMATION);
                    }
                    await QuestionService.addQuestionsAndAnswers(listQuestionAndAnswers, newPost.id, transaction);
                }
                //await StudentExamService.addStudentExams(newPost.id, studentIds, transaction);
            }
            if (files && files.length > EnumServerDefinitions.EMPTY) {
                const listFiles = FormatUtils.formatFileRequest(files, accountId);
                const newFiles = await FileService.createFiles(listFiles, transaction);
                const fileIds = newFiles.map(item => item.id);
                await PostFileService.addPostFiles(newPost.id, fileIds, transaction);
            }
            await transaction.commit();
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
    async updatePost(req, res) {
        const accountId = req.user.account_id;
        const postId = req.body.post_id;
        const title = req.body.title;
        const content = req.body.content;
        const topicId = req.body.topic_id;
        //const postCategoryId = req.body.post_category_id;
        const listFileRemove = req.body.list_file_remove;
        const files = req.files;
        const postIdParseInt = parseInt(postId);
        const transaction = await sequelize.transaction();
        try {
            const post = await PostService.findPostById(postIdParseInt);
            if (!post) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.ERROR_POST.POST_NOT_EXISTS);
            }
            await PostService.updatePost(post.id, title, content, topicId, transaction);
            //const isUpdatePost = await PostFileService
            if (post.post_category_id !== EnumServerDefinitions.POST_CATEGORY.NEWS) {
                const isPublic = req.body.is_public;
                const startDate = req.body.start_date;
                const finishDate = req.body.finish_date;
                const invertedQuestion = req.body.inverted_question;
                const invertedAnswer = req.body.inverted_answer;
                await PostDetailService.updatePostDetail(post.id, startDate, finishDate, invertedQuestion, invertedAnswer, isPublic);
                const newListStudentExams = req.body.list_student_exams;
                if (newListStudentExams && newListStudentExams.length > EnumServerDefinitions.EMPTY) {
                    const studentExams = await StudentExamService.findStudentExamsByPostId(post.id);
                    const studentExamIds = studentExams.map(item => item.student_id);
                    const studentsToRemove = studentExamIds.filter(student => !newListStudentExams.includes(student));
                    const studentsToAdd = newListStudentExams.filter(student => !studentExamIds.includes(student));
                    await StudentExamService.updateListStudentExamsByPostId(studentsToAdd, post.id, transaction);
                    await StudentExamService.removeStudentExamsByPostId(studentsToRemove, post.id, transaction);
                }
            }
            if (listFileRemove && listFileRemove.length > EnumServerDefinitions.EMPTY) {
                const isRemove = await FileService.removeFiles(listFileRemove, transaction);
                if (!isRemove) {
                    await transaction.rollback();
                    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                        EnumMessage.ERROR_DELETE);
                }
            }
            if (files && files.length > EnumServerDefinitions.EMPTY) {
                const listFiles = FormatUtils.formatFileRequest(files, accountId);
                const newFiles = await FileService.createFiles(listFiles, transaction);
                const fileIds = newFiles.map(item => item.id);
                await PostFileService.addPostFiles(newPost.id, fileIds, transaction);
            }
            await transaction.commit();
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
    async deletePost(req, res) {
        const postId = req.params.post_id;
        if (!postId) {
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                EnumMessage.REQUIRED_INFORMATION);
        }
        const transaction = await sequelize.transaction();
        try {
            const isDelete = await PostService.deletePost(postId, transaction);
            if (!isDelete) {
                await transaction.rollback();
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
                    EnumMessage.ERROR_DELETE);
            }
            await transaction.commit();
            return ServerResponse.createSuccessResponse(res, SystemConst.STATUS_CODE.SUCCESS);
        } catch (error) {
            await transaction.rollback();
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
}

module.exports = new PostController;
