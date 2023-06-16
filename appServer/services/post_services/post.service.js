const Post = require("../../models/post.model");
const { Op } = require('sequelize');
const PostFile = require("../../models/post_file.model");
const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const File = require("../../models/file.model");
const Comment = require("../../models/comment.model");
const Account = require("../../models/account.model");
const Student = require("../../models/student.model");
const Teacher = require("../../models/teacher.model");
const StudentExam = require("../../models/student_exam.model");
const PostDetail = require("../../models/post_detail.model");
const PostCategory = require("../../models/post_category.model");
const Classroom = require("../../models/classroom.model");
const StudentFileSubmission = require("../../models/student_file_submission.model");
const EnumMessage = require("../../common/enums/enum_message");

class PostService {
    async findPostById(id) {
        try {
            const post = await Post.findOne({
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return post;
        } catch (error) {
            throw error;
        }
    }
    async findAllPostsByClassroomId(classroomId) {
        try {
            const listPosts = await Post.findAll({
                where: {
                    classroom_id: classroomId,
                    post_category_id: { [Op.ne]: EnumServerDefinitions.POST_CATEGORY.NEWS },
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: [{
                    model: PostDetail,
                    where: {
                        //is_public: true,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    as: 'post_details',
                    attributes: []
                }]
            });
            return listPosts;
        } catch (error) {
            throw error;
        }
    }
    async findPostsByClassroomIdAndAccountId(classroomId, studentId = null) {
        try {
            const isTeacher = { '$post_category_id$': { [Op.ne]: EnumServerDefinitions.POST_CATEGORY.NEWS } };
            const condition = studentId ? { '$student_exams.student_id$': studentId } : isTeacher;
            const listPost = await Post.findAll({
                where: {
                    classroom_id: classroomId,
                    status: EnumServerDefinitions.STATUS.ACTIVE,
                    //'$student_exams.student_id$': { [Op.eq]: studentId }
                    [Op.or]: [{ post_category_id: EnumServerDefinitions.POST_CATEGORY.NEWS }, condition]
                },
                include: [
                    {
                        model: Classroom,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        as: 'classrooms',
                        attributes: [],
                    }, {
                        model: PostCategory,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        as: 'post_categories',
                        attributes: ['category_name']
                    }, {
                        model: PostFile, required: false, where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE,
                            '$Post.post_category_id$': {
                                [Op.eq]: EnumServerDefinitions.POST_CATEGORY.NEWS
                            }
                        },
                        attributes: ['id'],
                        as: 'post_files',
                        include: [{
                            model: File,
                            where: {
                                status: EnumServerDefinitions.STATUS.ACTIVE
                            },
                            attributes: ['id', 'file_name', 'physical_name', 'create_date', 'file_path']
                        }],
                    },
                    {
                        model: Comment,
                        required: false,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE,
                            '$Post.post_category_id$': {
                                [Op.eq]: EnumServerDefinitions.POST_CATEGORY.NEWS
                            }
                        },
                        include: [{
                            model: Account,
                            where: {
                                status: EnumServerDefinitions.STATUS.ACTIVE
                            },
                            include: [{
                                model: Student,
                                required: false,
                                where: {
                                    status: EnumServerDefinitions.STATUS.ACTIVE,
                                    '$comments->Account.role$': {
                                        [Op.eq]: EnumServerDefinitions.ROLE.STUDENT
                                    }
                                },
                                attributes: ['last_name', 'first_name']
                            }, {
                                model: Teacher,
                                required: false,
                                where: {
                                    status: EnumServerDefinitions.STATUS.ACTIVE,
                                    '$comments->Account.role$': {
                                        [Op.eq]: EnumServerDefinitions.ROLE.TEACHER
                                    }
                                },
                                attributes: ['last_name', 'first_name']
                            }],
                            attributes: ['id', 'role']
                        }],
                        as: 'comments',
                        attributes: ['id', 'content', 'comment_date'],
                        order: [['comment_date', 'ASC']]
                    }, {
                        model: StudentExam,
                        required: false,
                        where: {
                            student_id: studentId,
                            status: EnumServerDefinitions.STATUS.ACTIVE,
                            '$Post.post_category_id$': {
                                [Op.ne]: EnumServerDefinitions.POST_CATEGORY.NEWS
                            },
                        },
                        as: 'student_exams',
                        attributes: []
                    }, {
                        model: PostDetail,
                        required: false,
                        where: {
                            '$Post.post_category_id$': {
                                [Op.ne]: EnumServerDefinitions.POST_CATEGORY.NEWS
                            }
                        },
                        as: 'post_details',
                        attributes: ['finish_date']
                    }, {
                        model: Account,
                        required: false,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: ['id', 'role'],
                        as: 'accounts',
                        include: [
                            {
                                model: Teacher,
                                required: false,
                                where: {
                                    status: EnumServerDefinitions.STATUS.ACTIVE
                                },
                                attributes: ['last_name', 'first_name']
                            }, {
                                model: Student,
                                required: false,
                                where: {
                                    status: EnumServerDefinitions.STATUS.ACTIVE
                                },
                                attributes: ['last_name', 'first_name']
                            }
                        ]
                    }
                ],
                attributes: ['id', 'title', 'content', 'post_category_id'],
                order: [['create_date', 'DESC']]
            });
            return this.formatPost(listPost);
        } catch (error) {
            throw error;
        }
    }
    async getDetailPost(postId, studentId = null) {
        try {
            const whereCondition = {
                id: postId,
                post_category_id: {[Op.ne]: EnumServerDefinitions.POST_CATEGORY.NEWS},
                status: EnumServerDefinitions.STATUS.ACTIVE
              };
              if (studentId) {
                whereCondition['$student_exams.student_id$'] = studentId;
              }
            const postDetails = await Post.findOne({
                where: whereCondition,
                include: [{
                        model: PostFile,
                        required: false,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: ['id'],
                        as: 'post_files',
                        include: [{
                            model: File,
                            where: {
                                status: EnumServerDefinitions.STATUS.ACTIVE
                            },
                            attributes: ['id', 'file_name', 'physical_name', 'create_date', 'file_path']
                        }],
                    }, {
                        model: PostDetail,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: ['start_date', 'finish_date', 'inverted_question', 'inverted_answer'],
                        as: 'post_details',
                    }, {
                        model: Comment,
                        required: false,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        include: [{
                            model: Account,
                            where: {
                                status: EnumServerDefinitions.STATUS.ACTIVE
                            },
                            include: [{
                                model: Student,
                                required: false,
                                where: {
                                    status: EnumServerDefinitions.STATUS.ACTIVE
                                },
                                attributes: ['last_name', 'first_name']
                            }, {
                                model: Teacher,
                                required: false,
                                where: {
                                    status: EnumServerDefinitions.STATUS.ACTIVE
                                },
                                attributes: ['last_name', 'first_name']
                            }],
                            attributes: ['id', 'role']
                        }],
                        attributes: ['id', 'content', 'comment_date'],
                        order: [['comment_date', 'ASC']]
                    }, {
                        model: StudentExam,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: ['id', 'finish_date', 'total_score', 'submission'],
                        include: [{
                            model: StudentFileSubmission,
                            required: false,
                            where: {
                                status: EnumServerDefinitions.STATUS.ACTIVE
                            },
                            attributes: ['id'],
                            as: 'student_file_submissions',
                            include: [{
                                model: File,
                                where: {
                                    status: EnumServerDefinitions.STATUS.ACTIVE
                                },
                                attributes: ['id', 'file_name', 'physical_name', 'create_date', 'file_path']
                            }]
                        }],
                        as: 'student_exams',
                    }],
                attributes: ['id']
            });
            return this.formatPostDetail(postDetails);
        } catch (error) {
            throw error;
        }
    }
    formatPost(listPost) {
        const formattedListPost = listPost.map(post => {
            // const formattedPostFiles = post.post_files.map(postFile => ({
            //     post_file_id: postFile.id,
            //     file_name: postFile.File.file_name,
            //     physical_name: postFile.File.physical_name,
            //     file_path: postFile.File.file_path
            // }));
            const formattedPostFiles = this.formatFile(post.post_files);

            // const formatComments = post.comments.map(comment => {
            //     const account = this.formatAccount(comment.Account);
            //     return {
            //         id: comment.id,
            //         content: comment.content,
            //         comment_date: comment.comment_date,
            //         first_name: account.first_name,
            //         last_name: account.last_name
            //     }
            // });
            const formatComments = this.formatComments(post.comments);
            const account = this.formatAccount(post.accounts)
            const formattedPost = {
                id: post.id,
                title: post.title,
                content: post.content,
                create_date: post.create_date,
                category: post.post_categories.category_name,
                classroom_id: post.classroom_id,
                last_name: account.last_name,
                first_name: account.first_name,
                // topic_id: post.topic_id,
                files: formattedPostFiles,
                comments: formatComments
            };
            if (post.post_category_id !== EnumServerDefinitions.POST_CATEGORY.NEWS) {
                formattedPost.finish_date = post.post_details.finish_date;
            }
            return formattedPost;
        });
        return formattedListPost;
    }
    formatComments(listComments) {
        return listComments.map(comment => {
            const account = this.formatAccount(comment.Account);
            return {
                id: comment.id,
                content: comment.content,
                comment_date: comment.comment_date,
                first_name: account.first_name,
                last_name: account.last_name
            }
        });
    }
    formatAccount(account) {
        if (account.role === EnumServerDefinitions.ROLE.TEACHER) {
            // Nếu là giáo viên (role = 1)
            return {
                last_name: account.Teacher.last_name,
                first_name: account.Teacher.first_name
            };
        } else {
            // Nếu là học sinh (role = 2)
            return {
                last_name: account.Student.last_name,
                first_name: account.Student.first_name
            };
        }
    }
    formatFile(listFile) {
        return listFile.map(postFile => ({
            post_file_id: postFile.id,
            file_name: postFile.File.file_name,
            physical_name: postFile.File.physical_name,
            file_path: postFile.File.file_path
        }));
    }
    formatPostDetail(postDetail) {

        // const formatComments = postDetail.comments.map(comment => {
        //     const account = this.formatAccount(comment.Account);
        //     return {
        //         id: comment.id,
        //         content: comment.content,
        //         comment_date: comment.comment_date,
        //         first_name: account.first_name,
        //         last_name: account.last_name
        //     }
        // });
        const formatComments = this.formatComments(postDetail.comments);
        //const account = this.formatAccount(postDetail.accounts);
        const studentExams = postDetail.student_exams.map(item => ({
            id: item.id,
            finish_date: item.finish_date,
            total_score: item.total_score,
            submission: item.submission,
            file: this.formatFile(item.student_file_submissions)
        }));
        const formattedPost = {
            id: post.id,
            title: post.title,
            content: post.content,
            create_date: post.create_date,
            //category: post.post_categories.category_name,
            //classroom_id: post.classroom_id,
            //last_name: account.last_name,
            //first_name: account.first_name,
            // topic_id: post.topic_id,
            files: this.formatFile(post.post_files),
            comments: formatComments,
            student_exams: studentExams
        };
        return formattedPost;
    }
    async checkPostBelongTo(id) {
        try {
            const post = await Post.findOne({
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id', 'classroom_id'],
                include: [{
                    model: Classroom,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: []
                }]
            });
            return post;
        } catch (error) {
            throw error;
        }
    }
    async createPost(title, content, postCategoryId, accountId, classroomId, topicId, transaction) {
        try {
            const newPost = await Post.create({
                title: title,
                content: content,
                post_category_id: postCategoryId,
                account_id: accountId,
                classroom_id: classroomId,
                topic_id: topicId
            }, { transaction });
            return newPost;
        } catch (error) {
            throw error;
        }
    }
    async updatePost(id, title, content, topicId, transaction) {
        try {
            const post = await Post.update({
                title: title,
                content: content,
                //post_category_id: postCategoryId,
                //account_id: accountId,
                //classroom_id: classroomId,
                topic_id: topicId
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction,
                fields: ['title', 'content', 'topic_id']
            });
            if (post) {
                throw new Error(EnumMessage.ERROR_POST.POST_NOT_EXISTS);
            }
            return id;
        } catch (error) {
            throw error;
        }
    }
    async deletePost(id, transaction) {
        try {
            const post = await Post.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            return post > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PostService;