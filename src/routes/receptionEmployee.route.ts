import { IRoute } from "@core/interfaces";
import { Router } from "express";
import { ReceptionEmployeeController } from "controllers/receptionEmployee.controller";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";

export class ReceptionEmployeeRoute implements IRoute {
    public path = '/reception-employees';
    public router = Router();

    public receptionRoute = new ReceptionEmployeeController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.put(this.path + '/accept-appointment/:id', AuthMiddleware.authorization, this.receptionRoute.acceptAppointment);
        this.router.get(this.path + '/findAllQueueByBranchAndStatus', AuthMiddleware.authorization, this.receptionRoute.findAllQueueByBranchAndStatus);
        this.router.get(this.path + '/findAllEmployee', AuthMiddleware.authorization, this.receptionRoute.findAllEmployeeWithCondition);
    }
}