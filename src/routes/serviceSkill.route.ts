import { IRoute } from "@core/interfaces";
import { Router } from "express";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";
import { ServiceSkillController } from "controllers";
import { CreateDto } from "dtos/serviceSkill/create.dto";

export class serviceSkillRoute implements IRoute {
    public path = '/service-skills';
    public router = Router();

    public serviceskillRoute = new ServiceSkillController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/', errorMiddleware(CreateDto, 'body', false), AuthMiddleware.authorization, this.serviceskillRoute.create);
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.serviceskillRoute.searchs);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.serviceskillRoute.deleteList);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.serviceskillRoute.updateListstatus);
        this.router.put(this.path + '/:id', errorMiddleware(CreateDto, 'body', false), AuthMiddleware.authorization, this.serviceskillRoute.update);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.serviceskillRoute.delete);
        this.router.get(this.path + '/findById/:id', AuthMiddleware.authorization, this.serviceskillRoute.findById);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.serviceskillRoute.updatestatus);
    }
}