const Post = require("../../models/post.model");
const { Op } = require('sequelize');
const PostFile = require("../../models/post_file.model");
const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const File = require("../../models/file.model");
const Comment = require("../../models/comment.model");
const Account = require("../../models/account.model");
const Student = require("../../models/student.model");
const Teacher = require("../../models/teacher.model");

class PostService {
    async findPostsByClassroomIdAndAccountId(classroomId, accountId) {
        try {
            const listPost = await Post.findAll({
                where: {
                    classroom_id: classroomId,
                    account_id: accountId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: [
                    {
                        model: PostFile, required: false, where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE,
                            '$Post.post_category_id$': {
                                [Op.eq]: 1
                            }
                        },
                        as: 'post_files',
                        include: [{
                            model: File,
                            where: {
                                status: EnumServerDefinitions.STATUS.ACTIVE
                            },
                            attributes: {exclude: ['status', 'create_at', 'update_at']}
                        }],
                    },
                    {
                        model: Comment,
                        required: false,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE,
                            '$Post.post_category_id$': {
                                [Op.eq]: 1
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
                                attributes: ['id', 'last_name', 'first_name']
                            }, {
                                model: Teacher,
                                required: false,
                                where: {
                                    status: EnumServerDefinitions.STATUS.ACTIVE,
                                    '$comments->Account.role$': {
                                        [Op.eq]: EnumServerDefinitions.ROLE.TEACHER
                                    }
                                },
                                attributes: ['id', 'last_name', 'first_name']
                            }],
                            attributes: ['id', 'role']
                        }],
                        as: 'comments',
                        attributes: ['id', 'content', 'comment_date']
                    }
                ],
                attributes: ['id', 'title', 'content', 'topic_id']
            });
            return this.formatPost(listPost)
        } catch (error) {
            throw error;
        }
    }
    formatPost(listPost) {
        const formattedListPost = listPost.map(post => {
            const formattedPostFiles = post.post_files.map(postFile => ({
                file: postFile.File
            }));
            const formatComments =  post.comments.map(comment => ({
                content: comment.content,
                comment_date: comment.comment_date,
                account: comment.Account.role ? comment.Account.Teacher : comment.Account.Student
            }));
            return {
                id: post.id,
                title: post.title,
                content: post.content,
                create_date: post.create_date,
                post_category_id: post.post_category_id,
                account_id: post.account_id,
                classroom_id: post.classroom_id,
                topic_id: post.topic_id,
                status: post.status,
                create_at: post.create_at,
                update_at: post.update_at,
                files: formattedPostFiles.map((item)=> item.file),
                comment: formatComments
            };
        });
        return formattedListPost;
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
            }, { transaction: transaction });
            return newPost;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PostService;