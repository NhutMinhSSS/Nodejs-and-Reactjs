const ServerResponse = require("../common/utils/server_response");
const SystemConst = require("../common/consts/system_const");
const logger = require("../config/logger.config");
const fs = require("fs");
const EnumMessage = require("../common/enums/enum_message");
const FileService = require("../services/file_service/file.service");


class FileController {
    async sendFileToClient(req, res) {
        try {
            const fileId = req.params.file_id || null;
            const file = await FileService.findFileById(fileId);
            if(!file) {
                return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.NOT_FOUND,
                    EnumMessage.FILE_NOT_EXISTS);
            }
            const filePath = fs.readFileSync(file.file_path);
            if (filePath) {
                return res.download(filePath);
            }
        } catch (error) {
            logger.error(error);
            return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
                EnumMessage.DEFAULT_ERROR);
        }
    }
}

module.exports = new FileController;