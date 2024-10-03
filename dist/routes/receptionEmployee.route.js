"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceptionEmployeeRoute = void 0;
const express_1 = require("express");
const receptionEmployee_controller_1 = require("controllers/receptionEmployee.controller");
const middleware_1 = require("@core/middleware");
class ReceptionEmployeeRoute {
    constructor() {
        this.path = '/reception-employees';
        this.router = (0, express_1.Router)();
        this.receptionRoute = new receptionEmployee_controller_1.ReceptionEmployeeController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.put(this.path + '/accept-appointment/:id', middleware_1.AuthMiddleware.authorization, this.receptionRoute.acceptAppointment);
        this.router.get(this.path + '/findAllQueueByBranchAndStatus', middleware_1.AuthMiddleware.authorization, this.receptionRoute.findAllQueueByBranchAndStatus);
        this.router.get(this.path + '/findAllEmployee', middleware_1.AuthMiddleware.authorization, this.receptionRoute.findAllEmployeeWithCondition);
    }
}
exports.ReceptionEmployeeRoute = ReceptionEmployeeRoute;
//# sourceMappingURL=receptionEmployee.route.js.map