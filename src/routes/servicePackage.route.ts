import { IRoute } from "@core/interfaces";
import { Router } from "express";
import { ServicePackageController } from "controllers/servicePackage.controller";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";

export class ServicePackageRoute implements IRoute {
    public path = '/service-packages';
    public router = Router();

    public serivcePackageRoute = new ServicePackageController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/', AuthMiddleware.authorization, this.serivcePackageRoute.create);
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.serivcePackageRoute.searchs);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.serivcePackageRoute.deleteList);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.serivcePackageRoute.updateListstatus);
        this.router.put(this.path + '/:id', AuthMiddleware.authorization, this.serivcePackageRoute.update);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.serivcePackageRoute.delete);
        this.router.get(this.path + '/findById/:id', AuthMiddleware.authorization, this.serivcePackageRoute.findById);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.serivcePackageRoute.updatestatus);
    }
}