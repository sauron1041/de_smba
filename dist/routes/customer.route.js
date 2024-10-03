"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = require("express");
const middleware_1 = require("@core/middleware");
const controllers_1 = require("controllers");
class CustomerRoute {
    constructor() {
        this.path = '/customers';
        this.router = (0, express_1.Router)();
        this.customerRoute = new controllers_1.CustomerController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/appointment', middleware_1.AuthMiddleware.authorization, this.customerRoute.createAppointment);
        this.router.get(this.path + '/', middleware_1.AuthMiddleware.authorization, this.customerRoute.searchs);
        this.router.delete(this.path + '/delete-list', middleware_1.AuthMiddleware.authorization, this.customerRoute.deleteList);
        this.router.put(this.path + '/update-list-status', middleware_1.AuthMiddleware.authorization, this.customerRoute.updateListstatus);
        this.router.get(this.path + '/findById/:id', middleware_1.AuthMiddleware.authorization, this.customerRoute.findById);
        this.router.put(this.path + '/update-status/:id', middleware_1.AuthMiddleware.authorization, this.customerRoute.updatestatus);
    }
}
exports.CustomerRoute = CustomerRoute;
//# sourceMappingURL=customer.route.js.map