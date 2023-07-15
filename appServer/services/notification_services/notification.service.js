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
                        id: studentId,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: []
                },
                  {
                    model: Post,
                    required: true,
                    where: {
                      status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    include: [
                      {
                        model: Classroom,
                        required: true,
                        where: {
                          status: EnumServerDefinitions.STATUS.ACTIVE
                        },
                        include: [
                          {
                            model: Student,
                            required: true,
                            where: {
                              status: EnumServerDefinitions.STATUS.ACTIVE
                            },
                            through: {
                                where: {
                                  student_id: studentId,
                                  status: EnumServerDefinitions.STATUS.ACTIVE
                                },
                                attributes: []
                              },
                              attributes: ['id']
                          }
                        ],
                        as: 'classrooms',
                        attributes: ['id', 'class_name']
                      }
                    ],
                    attributes: ['id', 'post_category_id']
                  }
                ],
                attributes: ['id', 'post_id', 'message', 'create_date', 'read'],
                order: [['create_date', 'DESC']]
              });
              
              
            const result = listNotification.map(item => ({
                id: item.id,
                post_id: item.post_id,
                message: item.message,
                create_date: item.create_date,
                read: item.read,
                post_category_id: item.Post.post_category_id,
                class_name: item.Post.classrooms.class_name,
                classroom_id: item.Post.classrooms.id
            }));
            return result;
        } catch (error) {
            throw error;
        }
    }
    async createNotifications(studentIds, postId, message, transaction) {
        try {
            const listNotifications = studentIds.map(item => ({
                student_id: item,
                post_id: postId,
                message: message
            }));
            const newNotifications = Notification.bulkCreate(listNotifications, { transaction });
            return newNotifications;
        } catch (error) {
            throw error;
        }
    }
    async updateReadNotifiCation(notificationId) {
      try {
        const isUpdate = await Notification.update({
          read: true
        }, {
          where: {
            id: notificationId,
            status: EnumServerDefinitions.STATUS.ACTIVE
          }
        });
        return isUpdate > EnumServerDefinitions.EMPTY;
      } catch (error) {
        throw error;
      }
    }
}

module.exports = new NotificationService;