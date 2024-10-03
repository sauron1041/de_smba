"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("controllers");
const middleware_1 = require("@core/middleware");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const create_dto_1 = require("../dtos/user/create.dto");
const middleware_2 = require("@core/middleware");
class UserRoute {
    constructor() {
        this.path = '/users';
        this.router = (0, express_1.Router)();
        this.upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
        this.userController = new controllers_1.UserController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/', this.upload.single('file'), (0, middleware_1.errorMiddleware)(create_dto_1.Create, 'body', false), middleware_2.AuthMiddleware.authorization, this.userController.create);
        this.router.get(this.path + '/findById/:id', middleware_2.AuthMiddleware.authorization, this.userController.getOne);
        this.router.patch(this.path + '/:id', this.userController.updateProfile);
        this.router.delete(this.path + '/:id', middleware_2.AuthMiddleware.authorization, this.userController.delete);
        this.router.get(this.path + '/', middleware_2.AuthMiddleware.authorization, this.userController.searchs);
        this.router.get(this.path + '/get-profile', middleware_2.AuthMiddleware.authorization, this.userController.getProfileById);
    }
}
exports.default = UserRoute;
//# sourceMappingURL=user.route.js.map