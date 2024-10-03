"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableEmployeeRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("controllers");
const middleware_1 = require("@core/middleware");
class AvailableEmployeeRoute {
    constructor() {
        this.path = '/available-employees';
        this.router = (0, express_1.Router)();
        this.availableEmployeeRoute = new controllers_1.AvailableEmployeeController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/', middleware_1.AuthMiddleware.authorization, this.availableEmployeeRoute.create);
        this.router.get(this.path + '/', middleware_1.AuthMiddleware.authorization, this.availableEmployeeRoute.searchs);
        this.router.delete(this.path + '/delete-list', middleware_1.AuthMiddleware.authorization, this.availableEmployeeRoute.deleteList);
        this.router.put(this.path + '/update-list-status', middleware_1.AuthMiddleware.authorization, this.availableEmployeeRoute.updateListstatus);
        this.router.put(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.availableEmployeeRoute.update);
        this.router.delete(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.availableEmployeeRoute.delete);
        this.router.get(this.path + '/findById/:id', middleware_1.AuthMiddleware.authorization, this.availableEmployeeRoute.findById);
        this.router.put(this.path + '/update-status/:id', middleware_1.AuthMiddleware.authorization, this.availableEmployeeRoute.updatestatus);
    }
}
exports.AvailableEmployeeRoute = AvailableEmployeeRoute;
//# sourceMappingURL=availableEmployee.route.js.map