import { UserService } from "services";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "@core/utils";
import { Create } from "../dtos/user/create.dto";
import message from "@core/config/constants";

class UserController {
    public userServices = new UserService();

    public create = async (req: Request, res: Response, next: NextFunction) => {
        const model: Create = req.body as Create;
        model.user_id = 0
        try {
            const result = await this.userServices.create(model);
            if (result instanceof Error && result.field)
                return sendResponse(res, result.status, result.message, null, result.field);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.CREATE_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: number = req.params.id as any;
        try {
            const result = await this.userServices.delete(id);
            if (result instanceof Error && result.field)
                return sendResponse(res, result.status, result.message, null, result.field);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.DELETE_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public getOne = async (req: Request, res: Response, next: NextFunction) => {
        const id: number = req.params.id as any;
        try {
            const result = await this.userServices.getOne(id);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.FIND_BY_ID_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public searchs = async (req: Request, res: Response, next: NextFunction) => {
        const key: string = req.query.key as any;
        const username: string = req.query.username as any;
        const name: string = req.query.name as any;
        const phone: string = req.query.phone as any;
        const email: string = req.query.email as any;
        const page: number = req.query.page as any;
        const limit: number = req.query.limit as any;
        let pageInt = parseInt(page as any);
        let limitInt = parseInt(limit as any);

        const model: Create = {
            username: username,
            name: name,
            phone: phone,
            email: email
        }
        try {
            const result = await this.userServices.searchs(key, model, pageInt, limitInt);
            if (result instanceof Error && result.field)
                return sendResponse(res, result.status, result.message, null, result.field);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.SEARCH_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }

    public updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        const model: Create = req.body as Create;
        const id: number = req.params.id as any;
        try {
            const result = await this.userServices.updateProfile(model, id);
            if (result instanceof Error && result.field)
                return sendResponse(res, result.status, result.message, null, result.field);
            if (result instanceof Error)
                return sendResponse(res, 400, result.message);
            return sendResponse(res, 200, message.UPDATE_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public getProfileById = async (req: Request, res: Response, next: NextFunction) => {
        const id: number = req.id as any
        try {
            const result = await this.userServices.getProfileById(id);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.FIND_BY_ID_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
}
export default UserController;