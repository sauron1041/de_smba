import { IRoute } from "@core/interfaces";
import { Router } from "express";
import { ServiceController } from "controllers/service.controller";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";
import { CreateDto } from "dtos/service/create.dto";

class ServiceRoute implements IRoute {
    public path = '/services';
    public router = Router();

    public serivceRoute = new ServiceController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/', AuthMiddleware.authorization, this.serivceRoute.create);
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.serivceRoute.searchs);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.serivceRoute.deleteList);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.serivceRoute.updateListstatus);
        this.router.put(this.path + '/:id', AuthMiddleware.authorization, this.serivceRoute.update);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.serivceRoute.delete);
        this.router.get(this.path + '/findById/:id', AuthMiddleware.authorization, this.serivceRoute.findById);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.serivceRoute.updatestatus);
    }
}

export default ServiceRoute;