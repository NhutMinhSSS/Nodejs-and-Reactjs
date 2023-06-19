const EnumMessage = require("../enums/enum_message");

class ServerResponse {
    createSuccessResponse(res, statusCode, data) {
        const response = {
            result_message: EnumMessage.RESPONSE.SUCCESS
        };
        if (data) {
            response.response_data = data;
        }
        return res.status(statusCode).json(response);
    }
    createErrorResponse(res, statusCode, errorMessage) {
        return res.status(statusCode).json({
            result_message: EnumMessage.RESPONSE.FAILED,
            error_message: errorMessage
        });
    }
}

module.exports = new ServerResponse;