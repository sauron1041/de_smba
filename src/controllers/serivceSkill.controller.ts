import { sendResponse } from "@core/utils";
import { Request, Response, NextFunction } from "express";
import { CreateDto } from "dtos/serviceSkill/create.dto";
import message from "@core/config/constants";
import { SerivceSkillService } from "services/serviceSkill.service";

export class ServiceSkillController {
    public serviceSkillController = new SerivceSkillService();
    public create = async (req: Request, res: Response, next: NextFunction) => {
        const model = req.body;
        model.user_id = req.id;
        try {
            const result = await this.serviceSkillController.create(model);
            if (result instanceof Error && result.field)
                return sendResponse(res, result.status, result.message, null, result.field);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message as string);
            return sendResponse(res, 200, message.CREATE_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public update = async (req: Request, res: Response, next: NextFunction) => {
        const model: CreateDto = req.body;
        const id: number = req.params.id as any;
        try {
            const result = await this.serviceSkillController.update(model, id);
            if (result instanceof Error && result.field)
                return sendResponse(res, result.status, result.message, null, result.field);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message as string);
            return sendResponse(res, 200, message.UPDATE_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: number = req.params.id as any;
        try {
            const result = await this.serviceSkillController.delete(id);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.DELETE_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public findById = async (req: Request, res: Response, next: NextFunction) => {
        const id: number = req.params.id as any;
        try {
            const result = await this.serviceSkillController.findById(id);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.FIND_BY_ID_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public searchs = async (req: Request, res: Response, next: NextFunction) => {
        const name: string = req.query.name as any;
        const key: string = req.query.key as any;
        const status = req.query.status as any;
        const page = req.query.page as any;
        const limit = req.query.limit as any;
        const model: CreateDto = {

        }
        let pageInt = parseInt(page as any)
        let limitInt = parseInt(limit as any)
        try {
            const result = await this.serviceSkillController.searchs(key, pageInt, limitInt, model);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.FIND_ALL_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public updatestatus = async (req: Request, res: Response, next: NextFunction) => {
        const id: number = req.params.id as any;
        try {
            const result = await this.serviceSkillController.updateStatus(id);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.UPDATE_SUCCESS);
        } catch (error) {
            next(error);
        }
    }
    public deleteList = async (req: Request, res: Response, next: NextFunction) => {
        const listId: number[] = req.body.listId;
        try {
            const result = await this.serviceSkillController.deleteList(listId);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.DELETE_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public updateListstatus = async (req: Request, res: Response, next: NextFunction) => {
        const listId: number[] = req.body.listId;
        const status: number = req.body.status;
        try {
            const result = await this.serviceSkillController.updateListStatus(listId, status);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.UPDATE_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
}