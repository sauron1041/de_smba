import { sendResponse } from "@core/utils";
import { Request, Response, NextFunction } from "express";
import { CreateDto as Employee } from "dtos/availableEmployee/create.dto";
import message from "@core/config/constants";
import { EmployeeService } from "services/employeeService.service";

export class EmployeeController {
    public employeeController = new EmployeeService();

    public findEmployeeWithSkillOfService = async (req: Request, res: Response, next: NextFunction) => {
        const service_id: number = req.params.service_id as any;
        try {
            const result = await this.employeeController.findEmployeeWithSkillOfService(service_id);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.FIND_ALL_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
    public findAllEmployeeWithSkill = async (req: Request, res: Response, next: NextFunction) => {
        const model: Employee = req.query as any;

        try {
            const result = await this.employeeController.findAllEmployeeWithSkill(model);
            if (result instanceof Error)
                return sendResponse(res, result.status, result.message);
            return sendResponse(res, 200, message.FIND_ALL_SUCCESS, result);
        } catch (error) {
            next(error);
        }
    }
}