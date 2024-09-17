import { sendResponse } from "@core/utils";
import { Request, Response, NextFunction } from "express";
import { CreateDto as ServiceRequest } from "dtos/serviceRequest/create.dto";
import message from "@core/config/constants";
import { TechnicalEmployeeService } from "services";

export class TechnicalEmployeeController {
    public technicalEmployeeController = new TechnicalEmployeeService();

    public updateStatusServiceRequestCompleted = async (req: Request, res: Response, next: NextFunction) => {
        const model: ServiceRequest = req.body;
        const id: number = req.params.id as any;
        try {
            const result = await this.technicalEmployeeController.updateStatusServiceRequestCompleted(model, id);
            if (result instanceof Error && result.field)
                return sendResponse(res, result.status, result.message, null, result.field);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message as string);
            return sendResponse(res, 200, message.UPDATE_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
}