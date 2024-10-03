"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@core/utils/logger"));
const errorMiddleware = (error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    logger_1.default.error(`[ERROR] - Status: ${status} - Msg: ${message}`);
    res.status(status).json({
        message
    });
};
exports.default = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map