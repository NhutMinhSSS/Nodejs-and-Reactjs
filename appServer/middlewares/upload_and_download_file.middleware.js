const multer = require('multer');
const fs = require('fs');
const CommonService = require('../common/utils/common_service');
const FormatUtils = require('../common/utils/format.utils');
const StudentService = require('../services/student_services/student.service');
const uploadStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        if (!req.directoryPath) {
            let studentCode;
            if (!req.user.student_code) {
                const student = await StudentService.findStudentByAccountId(req.user.account_id);
                studentCode = student.student_code;
            } else {
                studentCode = req.user.student_code;
            }
            const timestamp = FormatUtils.dateTimeNow();
            const folderName = `${studentCode}_SV_${timestamp}_exercise`;
            const directory = `public/uploads/${folderName}/`;
            fs.mkdirSync(directory, { recursive: true });
            req.directoryPath = directory; // Lưu đường dẫn thư mục vào biến req
            req.user.user_code = userCode;
        }
        cb(null, req.directoryPath);
    },
    filename: (req, file, cb) => {
        const timestamp = FormatUtils.dateTimeNow();
        const fileExtension = getFileExtension(file.originalname);
        const studentCode = req.user.student_code;
        const fileName = `${studentCode}_SV_${timestamp}.${fileExtension}`
        cb(null, fileName);
    }
});
const downloadStorage = multer.diskStorage(
    {
        destination: async (req, file, cb) => {
            if (!req.directoryPath) {
                const role = req.user.role;
                let userCode;
                if (!req.user.user_code) {
                    const user = await CommonService.getTeacherCodeOrStudentCodeByAccountId(req.user.account_id, role);
                    userCode = user.user_code;
                } else {
                    userCode = req.user.user_code;
                }
                const timestamp = FormatUtils.dateTimeNow();
                const folderName = `${userCode}_${FormatUtils.getGVOrST(role)}_${timestamp}_document`
                const directory = `public/downloads/${folderName}/`;
                fs.mkdirSync(directory, { recursive: true });
                req.directoryPath = directory; // Lưu đường dẫn thư mục vào biến req
                req.user.user_code = userCode;
            }
            cb(null, req.directoryPath);
        },
        filename: (req, file, cb) => {
            const timestamp = FormatUtils.dateTimeNow();
            const userCode = req.user.user_code;
            const role = req.user.role;
            const fileExtension = getFileExtension(file.originalname);
            const fileName = `${userCode}_${FormatUtils.getGVOrST(role)}_${timestamp}.${fileExtension}`
            cb(null, fileName);
        }
    }
);

function getFileExtension(filename) {
    return filename.split('.').pop();
}
const upload = multer({ storage: uploadStorage });
const download = multer({ storage: downloadStorage });

module.exports = { upload, download };