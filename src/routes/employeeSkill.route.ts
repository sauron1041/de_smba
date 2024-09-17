import { IRoute } from "@core/interfaces";
import { Router } from "express";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";
import { EmployeeSkillController } from "controllers";
import { CreateDto } from "dtos/employeeSkill/create.dto";

export class EmployeeSkillRoute implements IRoute {
    public path = '/employee-skills';
    public router = Router();

    public employeeskillRoute = new EmployeeSkillController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/', AuthMiddleware.authorization, this.employeeskillRoute.create);
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.employeeskillRoute.searchs);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.employeeskillRoute.deleteList);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.employeeskillRoute.updateListstatus);
        this.router.put(this.path + '/:id', AuthMiddleware.authorization, this.employeeskillRoute.update);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.employeeskillRoute.delete);
        this.router.get(this.path + '/findById/:id', AuthMiddleware.authorization, this.employeeskillRoute.findById);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.employeeskillRoute.updatestatus);
    }
}