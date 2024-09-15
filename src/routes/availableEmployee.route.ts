import { IRoute } from "@core/interfaces";
import { Router } from "express";
import { AvailableEmployeeController } from "controllers";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";

export class AvailableEmployeeRoute implements IRoute {
    public path = '/available-employees';
    public router = Router();

    public availableEmployeeRoute = new AvailableEmployeeController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/', AuthMiddleware.authorization, this.availableEmployeeRoute.create);
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.availableEmployeeRoute.searchs);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.availableEmployeeRoute.deleteList);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.availableEmployeeRoute.updateListstatus);
        this.router.put(this.path + '/:id', AuthMiddleware.authorization, this.availableEmployeeRoute.update);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.availableEmployeeRoute.delete);
        this.router.get(this.path + '/findById/:id', AuthMiddleware.authorization, this.availableEmployeeRoute.findById);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.availableEmployeeRoute.updatestatus);
    }
}