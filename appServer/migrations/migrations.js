const logger = require("../config/logger");
const AccountClassroom = require("../models/account_classroom.model");
const Student = require('../models/student.model')
const Post = require("../models/post.model");

(async() => {
    try {
        await AccountClassroom.sync();
        await Student.sync();
        //await Post.sync();
        console.log("Bảng đã được tạo thành công!");
    } catch (error) {
        logger.error(error);
        console.log('Không thể tạo được bảng');
    }
})();
