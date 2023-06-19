const logger = require("../../config/logger.config");


class SocketService {
    // connect
    connection(socket) {
        try {
            socket.on('disconnect', () => {
                console.log(`User disconnect id is ${socket.id}`);
            });
            //join
            socket.on('join_classroom', room => {
                logger.info(`User joined room ${room}. ID: ${socket.id}`);
            })
            //event
            socket.on('', msg => {
                _io.emit('',);
            });
        } catch (error) {
            logger.error(error);
        }
    }

}