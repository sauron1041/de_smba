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
const exceptions_1 = require("@core/exceptions");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("@core/config/database"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkExist_1 = require("@core/utils/checkExist");
const constants_1 = __importDefault(require("@core/config/constants"));
class AuthServices {
    constructor() {
        this.tableName = 'users';
        this.login = (model) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield (0, checkExist_1.checkExist)(this.tableName, 'username', model.username);
                if (user == false)
                    return new exceptions_1.HttpException(404, constants_1.default.USERNAME_NOT_EXISTED, 'username');
                const validPassword = user && (yield bcryptjs_1.default.compare(model.password, user[0].password));
                if (!validPassword)
                    return new exceptions_1.HttpException(400, constants_1.default.PASSWORD_INCORRECT, 'password');
                let id = user[0].id;
                const accessToken = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
                const refreshToken = jsonwebtoken_1.default.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
                let query = `update ${this.tableName} set token = ? where username = ?`;
                yield database_1.default.executeQuery(query, [refreshToken, model.username]);
                if (Array.isArray(user) && user.length === 0)
                    return new exceptions_1.HttpException(404, constants_1.default.USERNAME_NOT_EXISTED, 'username');
                delete user[0].password;
                delete user[0].token;
                return {
                    data: {
                        user: Object.assign({}, user[0]),
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }
                };
            }
            catch (error) {
                return error;
            }
        });
        this.changePassword = (model) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield (0, checkExist_1.checkExist)(this.tableName, 'id', model.id.toString());
                if (user == false)
                    return new exceptions_1.HttpException(404, constants_1.default.NOT_EXISTED, 'id');
                const validPassword = user && (yield bcryptjs_1.default.compare(model.password, user[0].password));
                if (!validPassword)
                    return new exceptions_1.HttpException(400, constants_1.default.PASSWORD_INCORRECT, 'password');
                const hashedNewPassword = yield bcryptjs_1.default.hash(model.newPassword, 10);
                const result = yield database_1.default.executeQuery(`UPDATE ${this.tableName} SET password = ? WHERE id = ?`, [hashedNewPassword, model.id]);
                if (result.affectedRows === 0)
                    return new exceptions_1.HttpException(400, constants_1.default.UPDATE_FAILED);
                if (result.affectedRows > 0)
                    return;
            }
            catch (error) {
                return new exceptions_1.HttpException(500, constants_1.default.UPDATE_FAILED);
            }
        });
        this.uploadImage = (code, file) => __awaiter(this, void 0, void 0, function* () {
            const allowedFile = ['.png', '.jpg', '.jpeg'];
            if (!allowedFile.includes(path_1.default.extname(file.originalname)))
                return new exceptions_1.HttpException(400, constants_1.default.INVALID_FILE);
            const userDir = path_1.default.join(__dirname, process.env.USER_UPLOAD_IMAGE_PATH, code);
            this.createFolderIfNotExist(userDir);
            const fileExtension = path_1.default.extname(file.originalname);
            const uploadPath = path_1.default.join(userDir, `${code}${fileExtension}`);
            const upload = yield (0, sharp_1.default)(file.buffer).toFile(uploadPath);
            const files = fs_1.default.readdirSync(userDir);
            for (const fileName of files) {
                fs_1.default.unlinkSync(path_1.default.join(userDir, fileName));
            }
            if (upload) {
                yield (0, sharp_1.default)(file.buffer).toFile(uploadPath);
                const relativePath = path_1.default.relative(path_1.default.join(__dirname, process.env.USER_UPLOAD_IMAGE_PATH, '..'), uploadPath);
                return relativePath;
            }
            return new exceptions_1.HttpException(400, constants_1.default.UPLOAD_FAILED);
        });
        this.refreshToken = (refreshToken) => __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT * FROM ${this.tableName} WHERE token = ?`;
                const result = yield database_1.default.executeQuery(query, [refreshToken]);
                if (result.length === 0)
                    return new exceptions_1.HttpException(400, constants_1.default.REFRESH_TOKEN_FAILED);
                else {
                    const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                    if (!decoded)
                        return new exceptions_1.HttpException(400, constants_1.default.REFRESH_TOKEN_FAILED);
                    const id = decoded.id;
                    const accessToken = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
                    return {
                        data: {
                            accessToken: accessToken
                        }
                    };
                }
            }
            catch (error) {
                return new exceptions_1.HttpException(500, constants_1.default.REFRESH_TOKEN_FAILED);
            }
        });
        this.getProfileById = (id) => __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, checkExist_1.checkExist)(this.tableName, 'id', id.toString());
            if (result == false)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND, 'id');
            delete result[0].password;
            delete result[0].token;
            return {
                data: result[0]
            };
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.default.executeQuery(`update  ${this.tableName} set token = null WHERE token = ?`, [refreshToken]);
            if (result.affectedRows === 0)
                return new exceptions_1.HttpException(400, constants_1.default.LOGOUT_FAILED);
            return;
        });
    }
    createFolderIfNotExist(dir) {
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
    }
}
exports.default = AuthServices;
//# sourceMappingURL=auth.service.js.map