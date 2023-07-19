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
const Classroom = require("../../models/classroom.model");
const StudentFileSubmission = require("../../models/student_file_submission.model");
const EnumMessage = require("../../common/enums/enum_message");
const FormatUtils = require("../../common/utils/format.utils");

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
                    attributes: ['id', 'is_public']
                }]
            });
            return listPosts;
        } catch (error) {
            throw error;
        }
    }
    async findPostsByClassroomIdAndAccountId(classroomId, studentId = null) {
        try {
            const dateTimeNow = FormatUtils.dateTimeNow().format('YYYY-MM-DD HH:mm:ss');
            const isTeacher = { '$post_category_id$': { [Op.ne]: EnumServerDefinitions.POST_CATEGORY.NEWS } };
            const condition = studentId ? {
                '$student_exams.student_id$': studentId,
                [Op.or]: [{ '$post_details.is_hidden$': false }, { '$post_details.start_date$': { [Op.lt]: dateTimeNow } }]
            } : isTeacher;
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
                    }, /* {
                        model: PostCategory,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        as: 'post_categories',
                        attributes: ['category_name']
                    }, */ {
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
                            attributes: ['id', 'file_name', 'physical_name', 'file_type', 'file_path']
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
                        attributes: ['id', 'content', 'comment_date', 'account_id'],
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
                attributes: ['id', 'title', 'content', 'post_category_id', 'create_date', 'account_id'],
                order: [['create_date', 'DESC']]
            });
            return FormatUtils.formatPost(listPost);
        } catch (error) {
            throw error;
        }
    }
    async getDetailPost(postId, studentId = null) {
        try {
            const whereCondition = {
                id: postId,
                post_category_id: { [Op.ne]: EnumServerDefinitions.POST_CATEGORY.NEWS },
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
                        attributes: ['id', 'file_name', 'create_date', 'file_type']
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
                    as: 'comments',
                    attributes: ['id', 'content', 'comment_date', 'account_id'],
                    order: [['comment_date', 'ASC']]
                }, {
                    model: StudentExam,
                    required: false,
                    where: {
                        // '$Post.post_category_id$': {[Op.ne]: EnumServerDefinitions.POST_CATEGORY.DOCUMENT},
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
                            attributes: ['id', 'file_name', 'create_date']
                        }]
                    }, {
                        model: Student,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: ['first_name', 'last_name']
                    }],
                    as: 'student_exams',
                }, {
                    model: Account,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    include: [{
                        model: Teacher,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        attributes: ['first_name', 'last_name']
                    }],
                    attributes: ['id', 'role'],
                    as: 'accounts'
                }],
                attributes: ['id', 'title', 'content', 'post_category_id', 'create_date']
            });
            return FormatUtils.formatPostDetail(postDetails);
        } catch (error) {
            throw error;
        }
    }
    async checkPostBelongTo(id) {
        try {
            const post = await Post.findOne({
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id', 'classroom_id', 'post_category_id'],
                include: [{
                    model: Classroom,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: [],
                    as: 'classrooms'
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
            });
            return post > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
    async deletePost(id, transaction) {
        try {
            await PostFile.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    post_id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            await File.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: { [Op.in]: Post.sequelize.literal(`(SELECT file_id FROM post_files WHERE post_id = ${id} AND status = ${EnumServerDefinitions.STATUS.ACTIVE})`) },
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction,
            });
            const isDelete = await Post.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            return isDelete > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PostService;