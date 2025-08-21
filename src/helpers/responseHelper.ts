import { Response } from 'express';

export default class ResponseHelper {
    /**
     * Success response method.
     */
    static sendResponse(res: Response, result: any, message: string, code = 200) {
        const response = {
            success: true,
            data: result,
            message: message,
        };

        return res.status(code).json(response);
    }

    /**
     * Error response method.
     */
    static sendError(res: Response, error: string, errorMessages: any = [], code = 404) {
        const response: any = {
            success: false,
            message: error,
        };

        if (errorMessages && Object.keys(errorMessages).length > 0) {
            response.data = errorMessages;
        }

        return res.status(code).json(response);
    }
}
