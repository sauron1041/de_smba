"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __importDefault(require("@core/config/constants"));
const utils_1 = require("@core/utils");
const multer = require('multer');
const uploadArray = multer({
    limit: {
        fileSize: process.env.MAX_FILE_SIZE || 1024 * 1024 * 10
    }
}).array('files', parseInt(process.env.MAX_FILE_UPLOAD || '10'));
const uploadSingle = multer({
    limit: {
        fileSize: process.env.MAX_FILE_SIZE || 1024 * 1024 * 10
    }
}).single('file');
var uploadFileMiddleware;
(function (uploadFileMiddleware) {
    uploadFileMiddleware.array = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        uploadArray(req, res, (err) => {
            if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                return (0, utils_1.sendResponse)(res, 400, constants_1.default.LIMIT_FILE_SIZE, null, 'files');
            }
            if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
                return (0, utils_1.sendResponse)(res, 400, constants_1.default.FILE_OVER_LIMIT, null, 'files');
            }
            next();
        });
    });
    uploadFileMiddleware.single = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        uploadSingle(req, res, (err) => {
            if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                return (0, utils_1.sendResponse)(res, 400, constants_1.default.LIMIT_FILE_SIZE, null, 'file');
            }
            if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
                return (0, utils_1.sendResponse)(res, 400, constants_1.default.FILE_OVER_LIMIT, null, 'file');
            }
            next();
        });
    });
})(uploadFileMiddleware || (uploadFileMiddleware = {}));
exports.default = uploadFileMiddleware;
//# sourceMappingURL=uploadFile.middleware.js.map