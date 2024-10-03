"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSkillRoute = void 0;
const express_1 = require("express");
const middleware_1 = require("@core/middleware");
const controllers_1 = require("controllers");
class EmployeeSkillRoute {
    constructor() {
        this.path = '/employee-skills';
        this.router = (0, express_1.Router)();
        this.employeeskillRoute = new controllers_1.EmployeeSkillController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/', middleware_1.AuthMiddleware.authorization, this.employeeskillRoute.create);
        this.router.get(this.path + '/', middleware_1.AuthMiddleware.authorization, this.employeeskillRoute.searchs);
        this.router.delete(this.path + '/delete-list', middleware_1.AuthMiddleware.authorization, this.employeeskillRoute.deleteList);
        this.router.put(this.path + '/update-list-status', middleware_1.AuthMiddleware.authorization, this.employeeskillRoute.updateListstatus);
        this.router.put(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.employeeskillRoute.update);
        this.router.delete(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.employeeskillRoute.delete);
        this.router.get(this.path + '/findById/:id', middleware_1.AuthMiddleware.authorization, this.employeeskillRoute.findById);
        this.router.put(this.path + '/update-status/:id', middleware_1.AuthMiddleware.authorization, this.employeeskillRoute.updatestatus);
    }
}
exports.EmployeeSkillRoute = EmployeeSkillRoute;
//# sourceMappingURL=employeeSkill.route.js.map