const SystemConst = require('../common/consts/system_const');
const EnumMessage = require('../common/enums/enum_message');
const ServerResponse = require('../common/utils/server_response');
const logger = require('../config/logger.config');

const authorize = (allowedRoles) => (req, res, next) => {
  try {
      if (allowedRoles.includes(req.user.role)) {
        next();
      } else {
        throw new Error(EnumMessage.ACCESS_DENIED_ERROR);
      }
  } catch (error) {
    logger.error(error);
    return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST,
      error.message);
  }
}
module.exports = authorize;