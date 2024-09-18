import { IRoute } from "@core/interfaces";
import { Router } from "express";
import { TechnicalEmployeeController } from "controllers/technicalEmployee.controller";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";

export class TechnicalEmployeeRoute implements IRoute {
    public path = '/technical-employees';
    public router = Router();

    public receptionRoute = new TechnicalEmployeeController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.put(this.path + '/update-complete/:id', AuthMiddleware.authorization, this.receptionRoute.updateStatusServiceRequestCompleted);
    }
}