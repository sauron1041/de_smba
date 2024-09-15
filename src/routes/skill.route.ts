import { IRoute } from "@core/interfaces";
import { Router } from "express";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";
import { SkillController } from "controllers";
import { CreateDto } from "dtos/skill/create.dto";

export class SkillRoute implements IRoute {
    public path = '/skills';
    public router = Router();

    public skillRoute = new SkillController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/', errorMiddleware(CreateDto, 'body', false), AuthMiddleware.authorization, this.skillRoute.create);
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.skillRoute.searchs);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.skillRoute.deleteList);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.skillRoute.updateListstatus);
        this.router.put(this.path + '/:id', errorMiddleware(CreateDto, 'body', false), AuthMiddleware.authorization, this.skillRoute.update);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.skillRoute.delete);
        this.router.get(this.path + '/findById/:id', AuthMiddleware.authorization, this.skillRoute.findById);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.skillRoute.updatestatus);
    }
}