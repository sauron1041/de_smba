import { AuthServices } from "services";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "@core/utils";
import LoginDto from "../dtos/auth/login.dto";
import changePasseword from "../dtos/auth/changePassword.dto";
import message from "@core/config/constants";
import { RowDataPacket } from "mysql2";

class AuthController {
    public authServices = new AuthServices();

    public login = async (req: Request, res: Response, next: NextFunction) => {
        const model: LoginDto = req.body as LoginDto;
        try {
            const result = await this.authServices.login(model);
            if (result instanceof Error && (result as RowDataPacket).field)
                return sendResponse(res, (result as RowDataPacket).status, result.message, null, (result as RowDataPacket).field);
            if (result instanceof Error)
                return sendResponse(res, 400, result.message);
            return sendResponse(res, 200, message.LOGIN_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public changePassword = async (req: Request, res: Response, next: NextFunction) => {
        const model: changePasseword = req.body as changePasseword;
        model.id = req.id;
        try {
            const result = await this.authServices.changePassword(model);
            if (result instanceof Error && (result as RowDataPacket).field)
                return sendResponse(res, (result as RowDataPacket).status, result.message, null, (result as RowDataPacket).field);
            if (result instanceof Error)
                return sendResponse(res, 400, result.message);
            return sendResponse(res, 200, message.CHANGE_PASSWORD_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public logout = async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken: string = req.body.refreshToken;
        try {
            const result = await this.authServices.logout(refreshToken);
            if (result instanceof Error && (result as RowDataPacket).field)
                return sendResponse(res, (result as RowDataPacket).status, result.message, null, (result as RowDataPacket).field);
            if (result instanceof Error) {
                return sendResponse(res, result.status, result.message);
            }
            return sendResponse(res, 200, message.LOGOUT_SUCCESS);
        } catch (error) {
            next(error);
        }
    }
    public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken: string = req.body.refreshToken;
        try {
            const result = await this.authServices.refreshToken(refreshToken);
            if (result instanceof Error)
                return sendResponse(res, 400, result.message);
            return sendResponse(res, 200, message.REFRESH_TOKEN_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public getProfileById = async (req: Request, res: Response, next: NextFunction) => {
        const id: number = req.id as any
        try {
            const result = await this.authServices.getProfileById(id);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.FIND_BY_ID_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
}
export default AuthController;