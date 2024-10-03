import { sendResponse } from "@core/utils";
import { Request, Response, NextFunction } from "express";
import { CreateDto } from "dtos/customer/create.dto";
import message from "@core/config/constants";
import { CustomerService } from "services";
import { CreateDto as Appoinment } from "dtos/appointment/create.dto";
export class CustomerController {
    public customerController = new CustomerService();

    public findById = async (req: Request, res: Response, next: NextFunction) => {
        const id: number = req.params.id as any;
        try {
            const result = await this.customerController.findById(id);
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
        const phone = req.query.phone as any;
        const email = req.query.email as any;
        const loyalty_points = req.query.loyalty_points as any;

        const model: CreateDto = {
            name: name,
            status: status,
            phone: phone,
            email: email,
            loyalty_points: loyalty_points
        }
        let pageInt = parseInt(page as any)
        let limitInt = parseInt(limit as any)
        try {
            const result = await this.customerController.searchs(key, pageInt, limitInt, model);
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
            const result = await this.customerController.updateStatus(id);
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
            const result = await this.customerController.deleteList(listId);
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
            const result = await this.customerController.updateListStatus(listId, status);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.UPDATE_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public createAppointment = async (req: Request, res: Response, next: NextFunction) => {
        const model: Appoinment = req.body;
        model.user_id = req.id;
        try {
            const result = await this.customerController.createAppointment(model);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.CREATE_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
}