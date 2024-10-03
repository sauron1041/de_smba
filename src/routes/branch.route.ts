import { IRoute } from "@core/interfaces";
import { Router } from "express";
import { BranchController } from "controllers";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";

export class BranchRoute implements IRoute {
    public path = '/branch';
    public router = Router();

    public branchRoute = new BranchController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/', AuthMiddleware.authorization, this.branchRoute.create);
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.branchRoute.searchs);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.branchRoute.deleteList);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.branchRoute.updateListstatus);
        this.router.put(this.path + '/:id', AuthMiddleware.authorization, this.branchRoute.update);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.branchRoute.delete);
        this.router.get(this.path + '/findById/:id', AuthMiddleware.authorization, this.branchRoute.findById);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.branchRoute.updatestatus);
    }
}