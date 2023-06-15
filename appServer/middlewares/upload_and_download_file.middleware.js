const multer = require('multer');
const fs = require('fs');
const CommonService = require('../common/utils/common_service');
const uploadStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const name = '';
        const directory = `public/uploads/`;
        // Kiểm tra và tạo thư mục nếu nó chưa tồn tại
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        cb(null, directory);
    },
    filename: (req, file, cb) => {
        const fileName = Date.now().toString();
        const fileExtension = getFileExtension(file.originalname);
        const finalFileName = fileName + '.' + fileExtension;
        cb(null, finalFileName);
    }
});
const downloadStorage = multer.diskStorage(
    {
        destination: async(req, file, cb) => {
            if (!req.directoryPath) {
                const role = req.user.role;
                let userCode;
                if (!req.user.user_code) {
                    const user = await CommonService.getTeacherCodeOrStudentCodeByAccountId(req.user.account_id, role);
                    userCode = user.user_code;
                } else {
                    userCode = req.user.user_code
                }
                const timestamp = Date.now().toString();
                const name = `${userCode}_${CommonService.getGVOrST(role)}_${timestamp}_document`
                const directory = `public/downloads/${name}/`;
                fs.mkdirSync(directory, { recursive: true });
                req.directoryPath = directory; // Lưu đường dẫn thư mục vào biến req
                req.user.user_code = userCode;
              }
            cb(null, req.directoryPath);
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now().toString();
            const userCode = req.user.user_code;
            const role = req.user.role;
            const fileExtension = getFileExtension(file.originalname);
            const fileName = `${userCode}_${CommonService.getGVOrST(role)}_${timestamp}.${fileExtension}`
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