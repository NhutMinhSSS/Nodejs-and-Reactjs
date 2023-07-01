const logger = require("../../config/logger.config");


class SocketService {
    // connect
    connection(socket) {
        try {
            socket.on('disconnect', () => {
                console.log(`User disconnect id is ${socket.id}`);
            });
            //join
            socket.on('join_classroom', classroomId => {
                socket.join(classroomId)
                logger.info(`User joined room ${room}. ID: ${socket.id}`);
            })
            //event
            socket.on('new_post', (newPost) => {
                _io.to(newPost.classroom_id).emit('new_post', newPost);
            });
            socket.on('leave_classroom', classroomId => {
                socket.leave(classroomId)
            })
        } catch (error) {
            logger.error(error);
        }
    }

}

module.exports = new SocketService;