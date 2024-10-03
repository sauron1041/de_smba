"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("@core/middleware");
const login_dto_1 = __importDefault(require("../dtos/auth/login.dto"));
const changePassword_dto_1 = __importDefault(require("../dtos/auth/changePassword.dto"));
const controllers_1 = require("controllers");
class AuthRoute {
    constructor() {
        this.path = '/auth';
        this.router = (0, express_1.Router)();
        this.authController = new controllers_1.AuthController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/login', (0, middleware_1.errorMiddleware)(login_dto_1.default, 'body', false), this.authController.login);
        this.router.put(this.path + '/change-password', (0, middleware_1.errorMiddleware)(changePassword_dto_1.default, 'body', false), middleware_1.AuthMiddleware.authorization, this.authController.changePassword);
        this.router.post(this.path + '/logout', this.authController.logout);
        this.router.post(this.path + '/refresh-token', this.authController.refreshToken);
        this.router.get(this.path + '/getProfile', middleware_1.AuthMiddleware.authorization, this.authController.getProfileById);
    }
}
exports.default = AuthRoute;
//# sourceMappingURL=auth.route.js.map