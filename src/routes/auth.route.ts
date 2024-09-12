import { IRoute } from "@core/interfaces";
import { Router } from "express";
import multer from "multer";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";
import LoginDto from "../dtos/auth/login.dto";
import ChangePasswordDto from "../dtos/auth/changePassword.dto";
import UpdateProfileDao from "../dtos/auth/updateProfile.dto";
import UserMiddleware from "../middlewares/auth.middleware";
import { AuthController } from "controllers";

class AuthRoute implements IRoute {
    public path = '/auth';
    public router = Router();
    public authController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/login', errorMiddleware(LoginDto, 'body', false), this.authController.login)
        this.router.put(this.path + '/change-password', errorMiddleware(ChangePasswordDto, 'body', false), AuthMiddleware.authorization, this.authController.changePassword)
        this.router.post(this.path + '/logout', this.authController.logout)
        this.router.post(this.path + '/refresh-token', this.authController.refreshToken)
        this.router.get(this.path + '/getProfile', AuthMiddleware.authorization, this.authController.getProfileById)
    }
}

export default AuthRoute;   