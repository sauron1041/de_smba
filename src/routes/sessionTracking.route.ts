import { IRoute } from "@core/interfaces";
import { Router } from "express";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";
import { CreateDto } from "dtos/sessionTracking/create.dto";
import { SessionTrackingController } from "controllers";

class SessionTrackingRoute implements IRoute {
    public path = '/session-trackings';
    public router = Router();

    public sessionTrackingRoute = new SessionTrackingController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/', errorMiddleware(CreateDto, 'body', false), AuthMiddleware.authorization, this.sessionTrackingRoute.create);
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.sessionTrackingRoute.searchs);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.sessionTrackingRoute.deleteList);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.sessionTrackingRoute.updateListstatus);
        this.router.put(this.path + '/:id', errorMiddleware(CreateDto, 'body', false), AuthMiddleware.authorization, this.sessionTrackingRoute.update);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.sessionTrackingRoute.delete);
        this.router.get(this.path + '/findById/:id', AuthMiddleware.authorization, this.sessionTrackingRoute.findById);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.sessionTrackingRoute.updatestatus);
    }
}

export default SessionTrackingRoute;