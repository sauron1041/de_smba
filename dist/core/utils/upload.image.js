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
exports.UploadImage = void 0;
const exceptions_1 = require("@core/exceptions");
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
var UploadImage;
(function (UploadImage) {
    UploadImage.createFolderIfNotExist = (dir) => {
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
    };
    UploadImage.uploadImage = (code, file, UPLOAD_IMAGE_PATH) => __awaiter(this, void 0, void 0, function* () {
        const allowedFile = ['.png', '.jpg', '.jpeg'];
        if (!allowedFile.includes(path_1.default.extname(file.originalname)))
            return new exceptions_1.HttpException(400, 'invalid file type');
        const userDir = path_1.default.join(__dirname, process.env.UPLOAD_IMAGE_PATH, code);
        UploadImage.createFolderIfNotExist(userDir);
        const fileExtension = path_1.default.extname(file.originalname);
        const uploadPath = path_1.default.join(userDir, `${code}${fileExtension}`);
        const upload = yield (0, sharp_1.default)(file.buffer).toFile(uploadPath);
        const files = fs_1.default.readdirSync(userDir);
        for (const fileName of files) {
            fs_1.default.unlinkSync(path_1.default.join(userDir, fileName));
        }
        if (upload) {
            yield (0, sharp_1.default)(file.buffer).toFile(uploadPath);
            const relativePath = path_1.default.relative(path_1.default.join(__dirname, process.env.UPLOAD_IMAGE_PATH, '..'), uploadPath);
            return relativePath;
        }
        return new exceptions_1.HttpException(400, 'upload failed');
    });
})(UploadImage || (exports.UploadImage = UploadImage = {}));
//# sourceMappingURL=upload.image.js.map