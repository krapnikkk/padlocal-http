"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errorMiddleware = (error, _request, response, next) => {
    const status = error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || "Something went wrong";
    response.status(status).json({
        success: false,
        message,
        errors: error.errors
    });
    next();
};
exports.default = errorMiddleware;
//# sourceMappingURL=errorMiddleware.js.map