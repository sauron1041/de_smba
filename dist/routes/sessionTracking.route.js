"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("@core/middleware");
const create_dto_1 = require("dtos/sessionTracking/create.dto");
const controllers_1 = require("controllers");
class SessionTrackingRoute {
    constructor() {
        this.path = '/session-trackings';
        this.router = (0, express_1.Router)();
        this.sessionTrackingRoute = new controllers_1.SessionTrackingController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/', (0, middleware_1.errorMiddleware)(create_dto_1.CreateDto, 'body', false), middleware_1.AuthMiddleware.authorization, this.sessionTrackingRoute.create);
        this.router.get(this.path + '/', middleware_1.AuthMiddleware.authorization, this.sessionTrackingRoute.searchs);
        this.router.delete(this.path + '/delete-list', middleware_1.AuthMiddleware.authorization, this.sessionTrackingRoute.deleteList);
        this.router.put(this.path + '/update-list-status', middleware_1.AuthMiddleware.authorization, this.sessionTrackingRoute.updateListstatus);
        this.router.put(this.path + '/:id', (0, middleware_1.errorMiddleware)(create_dto_1.CreateDto, 'body', false), middleware_1.AuthMiddleware.authorization, this.sessionTrackingRoute.update);
        this.router.delete(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.sessionTrackingRoute.delete);
        this.router.get(this.path + '/findById/:id', middleware_1.AuthMiddleware.authorization, this.sessionTrackingRoute.findById);
        this.router.put(this.path + '/update-status/:id', middleware_1.AuthMiddleware.authorization, this.sessionTrackingRoute.updatestatus);
    }
}
exports.default = SessionTrackingRoute;
//# sourceMappingURL=sessionTracking.route.js.map