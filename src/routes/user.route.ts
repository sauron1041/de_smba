import { UserController } from "controllers";
import { IRoute } from "@core/interfaces";
import { errorMiddleware } from "@core/middleware";
import { Router } from "express";
import multer from "multer";
import { Create } from "../dtos/user/create.dto";
import { AuthMiddleware } from "@core/middleware";

class UserRoute implements IRoute {
    public path = '/users';
    public router = Router();
    public upload = multer({ storage: multer.memoryStorage() });

    public userController = new UserController();

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.post(this.path + '/', this.upload.single('file'), errorMiddleware(Create, 'body', false), AuthMiddleware.authorization, this.userController.create)
        this.router.get(this.path + '/findById/:id', AuthMiddleware.authorization, this.userController.getOne)
        this.router.patch(this.path + '/:id', this.userController.updateProfile)
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.userController.delete)
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.userController.searchs)
    }
}

export default UserRoute;   