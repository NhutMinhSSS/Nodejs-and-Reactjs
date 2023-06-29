const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const ServerResponse = require("../common/utils/server_response");
const logger = require("./logger.config");
const cors = require('cors');


const customCorsOptions = (req, res, next) => {
  try {
    if (req.headers.mobile && req.headers['x-api-key'] === SystemConst.API_KEY) {
        next();
    } else {
      const corsOptions = {
        origin: '*',
      };
      cors(corsOptions)(req, res, next);
    }
  } catch (error) {
      logger.error(error);
      return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.INTERNAL_SERVER,
        EnumMessage.NOT_ALLOW_BY_CORS);
  }
};

module.exports = customCorsOptions;