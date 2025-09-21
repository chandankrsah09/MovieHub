"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPaginatedResponse = exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, message, data, statusCode = 200) => {
    const response = {
        success: true,
        message,
        ...(data && { data })
    };
    res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, statusCode = 500) => {
    const response = {
        success: false,
        message
    };
    res.status(statusCode).json(response);
};
exports.sendError = sendError;
const sendPaginatedResponse = (res, message, data, page, limit, total) => {
    const pages = Math.ceil(total / limit);
    const response = {
        success: true,
        message,
        data,
        pagination: {
            page,
            limit,
            total,
            pages
        }
    };
    res.status(200).json(response);
};
exports.sendPaginatedResponse = sendPaginatedResponse;
//# sourceMappingURL=response.js.map