"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRequestRoute = void 0;
const express_1 = require("express");
const serviceRequest_controller_1 = require("controllers/serviceRequest.controller");
const middleware_1 = require("@core/middleware");
class ServiceRequestRoute {
    constructor() {
        this.path = '/service-requests';
        this.router = (0, express_1.Router)();
        this.serivceRoute = new serviceRequest_controller_1.ServiceRequestController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/', middleware_1.AuthMiddleware.authorization, this.serivceRoute.create);
        this.router.get(this.path + '/', middleware_1.AuthMiddleware.authorization, this.serivceRoute.searchs);
        this.router.delete(this.path + '/delete-list', middleware_1.AuthMiddleware.authorization, this.serivceRoute.deleteList);
        this.router.put(this.path + '/update-list-status', middleware_1.AuthMiddleware.authorization, this.serivceRoute.updateListstatus);
        this.router.put(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.serivceRoute.update);
        this.router.delete(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.serivceRoute.delete);
        this.router.get(this.path + '/findById/:id', middleware_1.AuthMiddleware.authorization, this.serivceRoute.findById);
        this.router.put(this.path + '/update-status/:id', middleware_1.AuthMiddleware.authorization, this.serivceRoute.updatestatus);
    }
}
exports.ServiceRequestRoute = ServiceRequestRoute;
//# sourceMappingURL=serviceRequest.route.js.map