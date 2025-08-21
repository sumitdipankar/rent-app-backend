"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseHelper {
    static sendResponse(res, result, message, code = 200) {
        const response = {
            success: true,
            data: result,
            message: message,
        };
        return res.status(code).json(response);
    }
    static sendError(res, error, errorMessages = [], code = 404) {
        const response = {
            success: false,
            message: error,
        };
        if (errorMessages && Object.keys(errorMessages).length > 0) {
            response.data = errorMessages;
        }
        return res.status(code).json(response);
    }
}
exports.default = ResponseHelper;
//# sourceMappingURL=responseHelper.js.map