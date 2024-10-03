"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const Logger = winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'logs/combined.log' }),
    ],
    format: winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.simple())
});
if (process.env.NODE_ENV == 'development') {
    Logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple()
    }));
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map