const ServerResponse = require("../common/utils/server_response");
const SystemConst = require("../common/consts/system_const");
const logger = require("../config/logger.config");
const fs = require("fs");
const EnumMessage = require("../common/enums/enum_message");
const FileService = require("../services/file_service/file.service");
const path = require("path");


class FileController {
    async showFileToClient(req, res) {
        try {
            const fileId = req.params.file_id;
            const file = await FileService.findFileById(fileId);
            if (!file) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.FILE_NOT_EXISTS);
            }
            const filePath = path.join(__dirname, '..', file.file_path, file.physical_name);
            if (!filePath) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.FILE_NOT_EXISTS);
            }
            // Thiết lập tiêu đề và loại nội dung của phản hồi
            res.setHeader('Content-Type', file.file_type);
          
            // Đọc tệp tin và gửi dữ liệu streaming từ server tới client
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
    async sendFileToClient(req, res) {
        try {
            const fileId = req.params.file_id;
            const file = await FileService.findFileById(fileId);
            if (!file) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.FILE_NOT_EXISTS);
            }
            const filePath = path.join(__dirname, '..', file.file_path, file.physical_name);
            if (!filePath) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.FILE_NOT_EXISTS);
            }
            res.header('Access-Control-Expose-Headers', 'Content-Disposition');
            const encodedFilename = encodeURIComponent(file.file_name);
            res.set('Content-Disposition', `attachment; filename="${encodedFilename}"`)
            res.set('Content-Type', file.file_type);
            return res.sendFile(filePath);
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
}

module.exports = new FileController;