import { IRoute } from "@core/interfaces";
import { Router } from "express";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";
import { SessionController } from "controllers";
import { CreateDto } from "dtos/session/create.dto";

class SessionRoute implements IRoute {
    public path = '/sessions';
    public router = Router();

    public sessionRoute = new SessionController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/', errorMiddleware(CreateDto, 'body', false), AuthMiddleware.authorization, this.sessionRoute.create);
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.sessionRoute.searchs);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.sessionRoute.deleteList);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.sessionRoute.updateListstatus);
        this.router.put(this.path + '/:id', errorMiddleware(CreateDto, 'body', false), AuthMiddleware.authorization, this.sessionRoute.update);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.sessionRoute.delete);
        this.router.get(this.path + '/findById/:id', AuthMiddleware.authorization, this.sessionRoute.findById);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.sessionRoute.updatestatus);
    }
}

export default SessionRoute;