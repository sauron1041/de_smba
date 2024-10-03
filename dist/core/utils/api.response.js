"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sendResponse;
const logger_1 = __importDefault(require("@core/utils/logger"));
function sendResponse(res, statusCode, message, data, field, errors) {
    logger_1.default.info(message);
    if ((statusCode == 404 || statusCode == 400 || statusCode == 403) && !field && !errors) {
        return res.status(200).json({
            statusCode,
            message
        });
    }
    if ((data || statusCode == 200 || 201) && !field && !errors) {
        return res.status(statusCode).json(Object.assign({ statusCode,
            message }, data));
    }
    if (field) {
        return res.status(200).json({
            statusCode,
            errors: [{
                    field,
                    message
                }]
        });
    }
    if (errors) {
        return res.status(200).json({
            statusCode,
            errors
        });
    }
}
//# sourceMappingURL=api.response.js.map