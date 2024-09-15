import { IRoute } from "@core/interfaces";
import { Router } from "express";
import { AppointmentController } from "controllers";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";

export class AppointmentRoute implements IRoute {
    public path = '/appointments';
    public router = Router();

    public appointmentRoute = new AppointmentController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/', AuthMiddleware.authorization, this.appointmentRoute.create);
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.appointmentRoute.searchs);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.appointmentRoute.deleteList);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.appointmentRoute.updateListstatus);
        this.router.put(this.path + '/:id', AuthMiddleware.authorization, this.appointmentRoute.update);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.appointmentRoute.delete);
        this.router.get(this.path + '/findById/:id', AuthMiddleware.authorization, this.appointmentRoute.findById);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.appointmentRoute.updatestatus);
    }
}