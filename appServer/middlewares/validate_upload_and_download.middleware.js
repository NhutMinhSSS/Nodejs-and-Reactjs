const SystemConst = require("../common/consts/system_const");
const EnumMessage = require("../common/enums/enum_message");
const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const ServerResponse = require("../common/utils/server_response");

const validateUploadFile = (req, res, next) => {
    const role = req.user.role;
    const postCategoryId = req.body.post_category_id;
    const title = req.body.title;
    if (postCategoryId !== EnumServerDefinitions.POST_CATEGORY.NEWS && role !== EnumServerDefinitions.ROLE.TEACHER) {
        return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.FORBIDDEN_REQUEST,
            EnumMessage.NO_PERMISSION);
    }
    if (!title) {
        return ServerResponse.createErrorResponse(res, SystemConst.STATUS_CODE.BAD_REQUEST,
            EnumMessage.REQUIRED_INFORMATION);
    }
    next();
}

module.exports = { validateUploadFile };