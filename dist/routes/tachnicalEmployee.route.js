"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicalEmployeeRoute = void 0;
const express_1 = require("express");
const technicalEmployee_controller_1 = require("controllers/technicalEmployee.controller");
const middleware_1 = require("@core/middleware");
class TechnicalEmployeeRoute {
    constructor() {
        this.path = '/technical-employees';
        this.router = (0, express_1.Router)();
        this.receptionRoute = new technicalEmployee_controller_1.TechnicalEmployeeController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.put(this.path + '/update-complete/:id', middleware_1.AuthMiddleware.authorization, this.receptionRoute.updateStatusServiceRequestCompleted);
    }
}
exports.TechnicalEmployeeRoute = TechnicalEmployeeRoute;
//# sourceMappingURL=tachnicalEmployee.route.js.map