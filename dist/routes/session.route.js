"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("@core/middleware");
const controllers_1 = require("controllers");
const create_dto_1 = require("dtos/session/create.dto");
class SessionRoute {
    constructor() {
        this.path = '/sessions';
        this.router = (0, express_1.Router)();
        this.sessionRoute = new controllers_1.SessionController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/', (0, middleware_1.errorMiddleware)(create_dto_1.CreateDto, 'body', false), middleware_1.AuthMiddleware.authorization, this.sessionRoute.create);
        this.router.get(this.path + '/', middleware_1.AuthMiddleware.authorization, this.sessionRoute.searchs);
        this.router.delete(this.path + '/delete-list', middleware_1.AuthMiddleware.authorization, this.sessionRoute.deleteList);
        this.router.put(this.path + '/update-list-status', middleware_1.AuthMiddleware.authorization, this.sessionRoute.updateListstatus);
        this.router.put(this.path + '/:id', (0, middleware_1.errorMiddleware)(create_dto_1.CreateDto, 'body', false), middleware_1.AuthMiddleware.authorization, this.sessionRoute.update);
        this.router.delete(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.sessionRoute.delete);
        this.router.get(this.path + '/findById/:id', middleware_1.AuthMiddleware.authorization, this.sessionRoute.findById);
        this.router.put(this.path + '/update-status/:id', middleware_1.AuthMiddleware.authorization, this.sessionRoute.updatestatus);
    }
}
exports.default = SessionRoute;
//# sourceMappingURL=session.route.js.map