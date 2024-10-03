"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRoute = void 0;
const express_1 = require("express");
const middleware_1 = require("@core/middleware");
const controllers_1 = require("controllers");
class EmployeeRoute {
    constructor() {
        this.path = '/employees';
        this.router = (0, express_1.Router)();
        this.employeeRoute = new controllers_1.EmployeeController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + '/findEmployeeWithSkillOfService/:service_id', middleware_1.AuthMiddleware.authorization, this.employeeRoute.findEmployeeWithSkillOfService);
        this.router.get(this.path + '/findAllEmployeeWithSkill', middleware_1.AuthMiddleware.authorization, this.employeeRoute.findAllEmployeeWithSkill);
    }
}
exports.EmployeeRoute = EmployeeRoute;
//# sourceMappingURL=employee.route.js.map