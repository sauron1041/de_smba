import { IRoute } from "@core/interfaces";
import { Router } from "express";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";
import { CustomerController } from "controllers";

export class CustomerRoute implements IRoute {
    public path = '/customers';
    public router = Router();

    public customerRoute = new CustomerController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/appointment', AuthMiddleware.authorization, this.customerRoute.createAppointment);
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.customerRoute.searchs);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.customerRoute.deleteList);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.customerRoute.updateListstatus);
        this.router.get(this.path + '/findById/:id', AuthMiddleware.authorization, this.customerRoute.findById);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.customerRoute.updatestatus);
    }
}