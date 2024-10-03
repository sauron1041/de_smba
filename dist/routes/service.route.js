"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_controller_1 = require("controllers/service.controller");
const middleware_1 = require("@core/middleware");
class ServiceRoute {
    constructor() {
        this.path = '/services';
        this.router = (0, express_1.Router)();
        this.serivceRoute = new service_controller_1.ServiceController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/', middleware_1.AuthMiddleware.authorization, this.serivceRoute.create);
        this.router.get(this.path + '/findAllSerivceWithSkill', this.serivceRoute.findAllSerivceWithSkill);
        this.router.get(this.path + '/', this.serivceRoute.searchs);
        this.router.delete(this.path + '/delete-list', middleware_1.AuthMiddleware.authorization, this.serivceRoute.deleteList);
        this.router.put(this.path + '/update-list-status', middleware_1.AuthMiddleware.authorization, this.serivceRoute.updateListstatus);
        this.router.put(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.serivceRoute.update);
        this.router.delete(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.serivceRoute.delete);
        this.router.get(this.path + '/findById/:id', middleware_1.AuthMiddleware.authorization, this.serivceRoute.findById);
        this.router.put(this.path + '/update-status/:id', middleware_1.AuthMiddleware.authorization, this.serivceRoute.updatestatus);
    }
}
exports.default = ServiceRoute;
//# sourceMappingURL=service.route.js.map