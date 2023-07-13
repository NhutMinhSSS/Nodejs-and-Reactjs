const EnumServerDefinitions = require("../../common/enums/enum_server_definitions");
const Classroom = require("../../models/classroom.model");
const Notification = require("../../models/notification.model");
const Post = require("../../models/post.model");
const Student = require("../../models/student.model");

class NotificationService {
    async findNotificationByStudentId(studentId) {
        try {
            const listNotification = await Notification.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: [{
                    model: Student,
                    required: true,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    include: [{
                        model: Classroom,
                        require: true,
                        where: {
                            status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        through: {
                            where: {
                                student_id: studentId,
                                status: EnumServerDefinitions.STATUS.ACTIVE
                            },
                            attributes: [],
                        },
                        attributes: ['id', 'class_name']
                    }],
                    attributes: ['id']
                }, {
                    model: Post,
                    required: true,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: []
                }],
                attributes: ['id', 'post_id', 'message', 'create_date', 'read']
            });
            const result = listNotification.map(item => ({
                id: item.id,
                post_id: item.post_id,
                message: item.message,
                create_date: item.create_date,
                read: item.read,
                class_name: item.Student.Classroom.class_name,
                classroom_id: item.Student.Classroom.id
            }));
            return result;
        } catch (error) {
            throw error;
        }
    }
    async createNotifications(studentIds, postId, transaction) {
        try {
            const listNotifications = studentIds.map(item => ({
                student_id: item,
                post_id: postId
            }));
            const newNotifications = Notification.bulkCreate(listNotifications, { transaction });
            return newNotifications;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new NotificationService;