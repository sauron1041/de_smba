import { IRoute } from "@core/interfaces";
import { Router } from "express";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";
import { EmployeeController } from "controllers";

export class EmployeeRoute implements IRoute {
    public path = '/employees';
    public router = Router();

    public employeeRoute = new EmployeeController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path + '/findEmployeeWithSkillOfService/:service_id', AuthMiddleware.authorization, this.employeeRoute.findEmployeeWithSkillOfService);
        this.router.get(this.path + '/findAllEmployeeWithSkill', AuthMiddleware.authorization, this.employeeRoute.findAllEmployeeWithSkill);
    }
}