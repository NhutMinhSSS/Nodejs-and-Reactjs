const logger = require('../config/logger');
const SystemConst = require('../common/consts/system_const');
const EnumMessage = require('../common/enums/enum_message');

const authorize = (allowedRoles) => (req, res, next) => {
  try {
      if (allowedRoles.includes(req.user.role)) {
        next();
      } else {
        throw new Error(EnumMessage.ACCESS_DENIED_ERROR);
      }
  } catch (error) {
    logger.error(error);
    return res.status(SystemConst.STATUS_CODE.FORBIDDEN_REQUEST).json({ result_message: error.message });
  }
}
module.exports = authorize;