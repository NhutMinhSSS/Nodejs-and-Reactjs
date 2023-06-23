const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const ServerResponse = require("../common/utils/server_response");
const logger = require("./logger.config");
const cors = require('cors');

const allowedIPs = ['192.168.1.15', '192.168.1.7', '171.245.160.248', '113.182.41.54', '103.249.21.111'];

const customCorsOptions = (req, res, next) => {
  try {
    const clientIP = req.ip; // Lấy địa chỉ IP của client
    if (allowedIPs.includes(clientIP)) {
      // Nếu địa chỉ IP nằm trong danh sách, cho phép CORS
      cors()(req, res, next);
    } else {
      // Nếu địa chỉ IP không nằm trong danh sách, từ chối CORS
      logger.error(`ip: ${clientIP} not allow by CORS`);
      return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST,
        EnumMessage.NOT_ALLOW_BY_CORS)
    }
  } catch (error) {
      logger.error(error);
      return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
        EnumMessage.NOT_ALLOW_BY_CORS);
  }
};

module.exports = customCorsOptions;