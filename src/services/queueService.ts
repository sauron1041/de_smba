import database from "@core/config/database";
import { CreateDto } from "dtos/serviceRequest/create.dto";
import { HttpException } from "@core/exceptions";
import { checkExist } from "@core/utils/checkExist";
import { IPagiantion } from "@core/interfaces";
import { RowDataPacket } from "mysql2";
import errorMessages from "@core/config/constants";
import { CustomerService } from "./customer.service";
import { AvailableEmployeeService } from "./availableEmployee.service";
import { SerivceSkillService } from "./serviceSkill.service";
import { ServiceRequestService } from "./serviceRequest.service";

export class QueueService {
    private tableName = 'service_request';
    private fieldId = 'id'

    private customerService = new CustomerService();
    private availableEmployeeService = new AvailableEmployeeService();
    private serviceSkillsService = new SerivceSkillService();
    private serviceRequestService = new ServiceRequestService();

    public addCustomerToQueue = async (model: CreateDto) => {
        const created_at = new Date()
        const updated_at = new Date()
        const checkCustomer = await this.customerService.findById(model.customer_id!);
        if (checkCustomer instanceof HttpException) return new HttpException(400, errorMessages.NOT_EXISTED, 'customer_id');
        const checkService = await database.executeQuery(`select * from ${this.tableName} where id = ?`, [model.service_id]);
        if ((checkService as RowDataPacket[]).length === 0)
            return new HttpException(400, errorMessages.NOT_EXISTED, 'service_id');
        let query = `insert into ${this.tableName} (status, check_in_time, service_id, user_id, updated_at) values (?, ?, ?, ?, ?)`;
        let values = [model.status || 0, model.check_in_time || new Date(), model.service_id, model.user_id, updated_at];
        const result = await database.executeQuery(query, values);
        if ((result as any).affectedRows === 0)
            return new HttpException(400, errorMessages.CREATE_FAILED)
        return {
            data: {
                id: (result as any).insertId,
                ...model,
                created_at: created_at,
                updated_at: updated_at
            }
        }
    }

    public updateCustomerInQueue = async (id: number, model: CreateDto) => {
        if (!await checkExist(this.tableName, this.fieldId, id.toString()))
            return new HttpException(400, errorMessages.NOT_EXISTED, this.fieldId);
        let query = `update ${this.tableName} set `;
        let values = [];
        if (model.service_id != undefined) {
            query += `service_id = '${model.service_id}', `
            values.push(model.service_id)
        }
        if (model.status != undefined) {
            query += `status = '${model.status}', `
            values.push(model.status || null)
        }
        if (model.user_id != undefined) {
            query += `user_id = '${model.user_id}', `
            values.push(model.user_id)
        }
        if (model.check_in_time != undefined) {
            query += `check_in_time = '${model.check_in_time}', `
            values.push(model.check_in_time)
        }
        if (model.serving_at != undefined) {
            query += `serving_at = '${model.serving_at}', `
            values.push(model.serving_at)
        }
        if (model.completed_at != undefined) {
            query += `completed_at = '${model.completed_at}', `
            values.push(model.completed_at)
        }
        // if(model.cancel_at != undefined){
        //     query += `cancel_at = '${model.cancel_at}', `
        //     values.push(model.cancel_at)
        // }
        query += `updated_at = ? where id = ?`
        const updated_at = new Date()
        values.push(updated_at)
        values.push(id)
        const result = await database.executeQuery(query, values);
        if ((result as any).affectedRows === 0)
            return new HttpException(400, errorMessages.UPDATE_FAILED)
        return {
            data: {
                id: id,
                ...model,
                updated_at: updated_at
            }
        }
    }


    public delete = async (id: number) => {
        if (!await checkExist(this.tableName, this.fieldId, id.toString()))
            return new HttpException(400, errorMessages.EXISTED);
        const result = await database.executeQuery(`delete from ${this.tableName} where id = ?`, [id]);
        if ((result as any).affectedRows === 0)
            return new HttpException(400, errorMessages.DELETE_FAILED);
        return {
            message: errorMessages.DELETE_SUCCESS,
        }
    }
    public findById = async (id: number) => {
        const result = await checkExist(this.tableName, this.fieldId, id.toString());
        if (result == false)
            return new HttpException(400, errorMessages.NOT_EXISTED);
        return {
            data: (result as any)[0]
        }
    }
    public searchs = async (key: string, page: number, limit: number, model: CreateDto) => {
        let query = `select * from ${this.tableName} where 1=1`;
        let countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE 1=1`;

        if (key && key.length != 0) {
            query += ` and name like '%${key}%'`
            countQuery += ` and name like '%${key}%'`
        }
        if (model.status) {
            query += ` and status = ${model.status}`
            countQuery += ` and status = ${model.status}`
        }
        if (model.check_in_time) {
            query += ` and check_in_time = ${model.check_in_time}`
            countQuery += ` and check_in_time = ${model.check_in_time}`
        }
        if (model.service_id) {
            query += ` and service_id = ${model.service_id}`
            countQuery += ` and service_id = ${model.service_id}`
        }
        if (model.user_id) {
            query += ` and user_id = ${model.user_id}`
            countQuery += ` and user_id = ${model.user_id}`
        }
        query += ` order by id desc`
        if (limit && !page && limit > 0) {
            query = query + ` LIMIT ` + limit;
        }
        else if (page && page > 0 && limit && limit > 0) {
            query = query + ` LIMIT ` + limit + ` OFFSET ` + (page - 1) * limit;
        }
        let pagination: IPagiantion = {
            page: page,
            limit: limit,
            totalPage: 0
        }
        const count = await database.executeQuery(countQuery);
        const totalPages = Math.ceil((count as RowDataPacket[])[0].total / limit);
        if (Array.isArray(count) && count.length > 0)
            pagination.totalPage = totalPages
        const result = await database.executeQuery(query);
        if (Array.isArray(result) && result.length === 0)
            return new HttpException(404, errorMessages.NOT_FOUND)
        return {
            data: result,
            pagination: pagination
        }
    }
    public updateStatus = async (id: number) => {
        try {
            let result = null;
            let status: number = 0
            const update_at = new Date()
            const getStatus = await database.executeQuery(`select status from ${this.tableName} where id = ?`, [id]);
            if ((getStatus as RowDataPacket[]).length === 0)
                return new HttpException(404, errorMessages.NOT_FOUND);
            if ((getStatus as RowDataPacket[])[0].status == 0) {
                status = 1
                result = await database.executeQuery(`update ${this.tableName} set status = ?, updated_at = ? where id = ?`, [status, update_at, id]);
            }
            if ((getStatus as RowDataPacket[])[0].status == 1) {
                result = await database.executeQuery(`update ${this.tableName} set status = ?, updated_at = ? where id = ?`, [status, update_at, id]);
            }
            return {
                data: {
                    id: id,
                    status: status,
                    updated_at: update_at
                }
            }
        }
        catch (error) {
            return new HttpException(500, errorMessages.UPDATE_FAILED);
        }
    }
    public deleteList = async (data: number[]) => {
        let query = `delete from ${this.tableName} where id in (${data})`
        const result = await database.executeQuery(query);
        if ((result as any).affectedRows === 0)
            return new HttpException(400, errorMessages.DELETE_FAILED);
        return {
            message: errorMessages.DELETE_SUCCESS
        }
    }
    public updateListStatus = async (data: number[], status: number) => {
        try {
            let result = null;
            const update_at = new Date()
            let query = `update ${this.tableName} set status = ?, updated_at = ? where id in (${data})`
            result = await database.executeQuery(query, [status, update_at]);
            return {
                data: {
                    status: status,
                    updated_at: update_at
                }
            }
        }
        catch (error) {
            return new HttpException(500, errorMessages.UPDATE_FAILED);
        }
    }
    public findAllCustomerOrderByCheckInTime = async () => {
        const result = await database.executeQuery(`select * from ${this.tableName} where status = 1 order by check_in_time asc`);
        if ((result as RowDataPacket[]).length === 0)
            return new HttpException(404, errorMessages.NOT_FOUND)
        return {
            data: result
        }
    }
    // public handlePendingCustomer = async (service_id: number) => {
    //     const checkAvailableTechnicanSkill = await this.serviceSkillsService.findEmployeeByStatus(service_id, 1);
    //     if (checkAvailableTechnicanSkill.length == 0)
    //         return new HttpException(400, errorMessages.NO_TECHNICAN_AVAILABLE)
    //     return {
    //         data: checkAvailableTechnicanSkill
    //     }
    // }
    public handlePendingCustomer = async (service_id: number) => {
        // const checkServiceSkill = await this.availableEmployeeService.findEmployeeWithSkillsByEmployeeId(service_id);
        // if ((checkServiceSkill as RowDataPacket).length == 0) {
        //     return new HttpException(400, errorMessages.NO_TECHNICAN_AVAILABLE)
        // }
        // if ((checkServiceSkill as RowDataPacket).length > 0) {
        //     if ((checkServiceSkill as RowDataPacket)[0].status == 0) {
        //         return new HttpException(400, errorMessages.NO_TECHNICAN_AVAILABLE)
        //     }
        //     else if ((checkServiceSkill as RowDataPacket)[0].status == 1) {
        //         // return {
        //         //     data: checkServiceSkill
        //         // }
        //         // const handle
        //     }
        // }
        const result = await this.serviceRequestService.update({ status: 2 }, service_id);
        if (result instanceof HttpException) return new HttpException(400, errorMessages.UPDATE_FAILED);
        return {
            data: result
        }
    }
    public hanleCompletedCustomer = async (service_id: number) => {
        const update_at = new Date()
        const result = await this.serviceRequestService.update({ status: 4, completed_at: update_at }, service_id);
        if (result instanceof HttpException) return new HttpException(400, errorMessages.UPDATE_FAILED);
        return {
            data: result
        }
    }
    public handleCancelCustomer = async (service_id: number) => {
        const update_at = new Date()
        const result = await this.serviceRequestService.update({ status: 5, completed_at: update_at }, service_id);
        if (result instanceof HttpException) return new HttpException(400, errorMessages.UPDATE_FAILED);
        return {
            data: result
        }
    }
    public handleServingCustomer = async (service_id: number) => {
        const update_at = new Date()
        const result = await this.serviceRequestService.update({ status: 3, serving_at: update_at }, service_id);
        if (result instanceof HttpException) return new HttpException(400, errorMessages.UPDATE_FAILED);
        return {
            data: result
        }
    }
    public handleCheckinCustomer = async (service_id: number) => {
        const update_at = new Date()
        const result = await this.serviceRequestService.update({ status: 1, check_in_time: update_at }, service_id);
        if (result instanceof HttpException) return new HttpException(400, errorMessages.UPDATE_FAILED);
        return {
            data: result
        }
    }
    public handleQueueCustomer = async () => {
        const checkServiceRequest = await this.serviceRequestService.findServiceByStatus(2)
        for (let i = 0; i < (checkServiceRequest as RowDataPacket).data.length; i++) {
            const checkServiceSkill = await this.availableEmployeeService.findEmployeeByStatus((checkServiceRequest as RowDataPacket).data[i].service_id, 1);
            if ((checkServiceSkill as RowDataPacket).length == 0) {
                return new HttpException(400, errorMessages.NO_TECHNICAN_AVAILABLE)
            }
            if ((checkServiceSkill as RowDataPacket).length > 0) {
                if ((checkServiceSkill as RowDataPacket)[0].status == 0) {
                    return new HttpException(400, errorMessages.NO_TECHNICAN_AVAILABLE)
                }
                else if ((checkServiceSkill as RowDataPacket)[0].status == 1) {
                    const result = await this.serviceRequestService.update({ status: 3 }, (checkServiceRequest as RowDataPacket).data[i].id);
                    if (result instanceof HttpException) return new HttpException(400, errorMessages.UPDATE_FAILED);
                }

            }
        }
    }
}