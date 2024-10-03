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
const services_1 = require("services");
const utils_1 = require("@core/utils");
const constants_1 = __importDefault(require("@core/config/constants"));
class AuthController {
    constructor() {
        this.authServices = new services_1.AuthServices();
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const model = req.body;
            try {
                const result = yield this.authServices.login(model);
                if (result instanceof Error && result.field)
                    return (0, utils_1.sendResponse)(res, result.status, result.message, null, result.field);
                if (result instanceof Error)
                    return (0, utils_1.sendResponse)(res, 400, result.message);
                return (0, utils_1.sendResponse)(res, 200, constants_1.default.LOGIN_SUCCESS, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.changePassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const model = req.body;
            model.id = req.id;
            try {
                const result = yield this.authServices.changePassword(model);
                if (result instanceof Error && result.field)
                    return (0, utils_1.sendResponse)(res, result.status, result.message, null, result.field);
                if (result instanceof Error)
                    return (0, utils_1.sendResponse)(res, 400, result.message);
                return (0, utils_1.sendResponse)(res, 200, constants_1.default.CHANGE_PASSWORD_SUCCESS, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.body.refreshToken;
            try {
                const result = yield this.authServices.logout(refreshToken);
                if (result instanceof Error && result.field)
                    return (0, utils_1.sendResponse)(res, result.status, result.message, null, result.field);
                if (result instanceof Error) {
                    return (0, utils_1.sendResponse)(res, result.status, result.message);
                }
                return (0, utils_1.sendResponse)(res, 200, constants_1.default.LOGOUT_SUCCESS);
            }
            catch (error) {
                next(error);
            }
        });
        this.refreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.body.refreshToken;
            try {
                const result = yield this.authServices.refreshToken(refreshToken);
                if (result instanceof Error)
                    return (0, utils_1.sendResponse)(res, 400, result.message);
                return (0, utils_1.sendResponse)(res, 200, constants_1.default.REFRESH_TOKEN_SUCCESS, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.getProfileById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.id;
            try {
                const result = yield this.authServices.getProfileById(id);
                if (result instanceof Error)
                    return (0, utils_1.sendResponse)(res, result.status, result.message);
                return (0, utils_1.sendResponse)(res, 200, constants_1.default.FIND_BY_ID_SUCCESS, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map