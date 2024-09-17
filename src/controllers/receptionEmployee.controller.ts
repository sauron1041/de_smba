import { sendResponse } from "@core/utils";
import { Request, Response, NextFunction } from "express";
import { CreateDto as ServiceRequest } from "dtos/serviceRequest/create.dto";
import message from "@core/config/constants";
import { ReceptionEmployeeService } from "services";
import { CreateDto as AvailableeEmployee } from "dtos/availableEmployee/create.dto";
export class ReceptionEmployeeController {
    public receptionEmployeeController = new ReceptionEmployeeService();

    public acceptAppointment = async (req: Request, res: Response, next: NextFunction) => {
        const id: number = req.params.id as any;
        const status: number = req.body.status as any;
        try {
            const result = await this.receptionEmployeeController.acceptAppointment(id, status);
            if (result instanceof Error && result.field)
                return sendResponse(res, result.status, result.message, null, result.field);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message as string);
            return sendResponse(res, 200, message.UPDATE_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public findAllQueueByBranchAndStatus = async (req: Request, res: Response, next: NextFunction) => {
        const branch_id: number = req.query.branch_id as any;
        const status: number = req.query.status as any;
        try {
            const result = await this.receptionEmployeeController.findAllQueueByBranchAndStatus(branch_id, status);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.FIND_ALL_SUCCESS, result);
        } catch (error) {
            next(error);

        }
    }
    public findAllEmployeeWithCondition = async (req: Request, res: Response, next: NextFunction) => {
        const model: AvailableeEmployee = req.body;
        try {
            const result = await this.receptionEmployeeController.findAllEmployeeWithCondition(model);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.FIND_ALL_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
}