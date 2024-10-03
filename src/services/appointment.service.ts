import database from "@core/config/database";
import { CreateDto } from "dtos/appointment/create.dto";
import { HttpException } from "@core/exceptions";
import { checkExist } from "@core/utils/checkExist";
import { IPagiantion } from "@core/interfaces";
import { RowDataPacket } from "mysql2";
import errorMessages from "@core/config/constants";
import { ServiceRequestService } from "./serviceRequest.service";
import { CreateDto as ServiceRequest } from "dtos/serviceRequest/create.dto";

export class AppointmentService {
    private tableName = 'appointment';
    private fieldId = 'id'

    
    private serviceRequestService = new ServiceRequestService()

    public create = async (model: CreateDto) => {
        const created_at = new Date()
        const updated_at = new Date()
        let query = `insert into ${this.tableName} (date, time, status, customer_id, employee_id, service_id, note, reminder_sent, branch_id, user_id, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let values = [model.date || new Date(), model.time || new Date(), model.status || 1, model.customer_id || 1, model.employee_id || null, model.service_id, model.note || null, model.reminder_sent || false, model.branch_id || 1, model.user_id, created_at, updated_at];
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
    public update = async (model: CreateDto, id: number) => {
        if (!await checkExist(this.tableName, this.fieldId, id.toString()))
            return new HttpException(400, errorMessages.EXISTED, this.fieldId);
        let query = `update ${this.tableName} set `;
        let values = [];
        if (model.date != undefined) {
            query += `date = ?, `
            values.push(model.date)
        }
        if (model.time != undefined) {
            query += `time = ?, `
            values.push(model.time)
        }
        if (model.status != undefined) {
            query += `status = ?, `
            values.push(model.status)
        }
        if (model.customer_id != undefined) {
            query += `customer_id = ?, `
            values.push(model.customer_id)
        }
        if (model.employee_id != undefined) {
            query += `employee_id = ?, `
            values.push(model.employee_id)
        }
        if (model.service_id != undefined) {
            query += `service_id = ?, `
            values.push(model.service_id)
        }
        if (model.note != undefined) {
            query += `note = ?, `
            values.push(model.note)
        }
        if (model.reminder_sent != undefined) {
            query += `reminder_sent = ?, `
            values.push(model.reminder_sent)
        }
        if (model.branch_id != undefined) {
            query += `branch_id = ?, `
            values.push(model.branch_id)
        }
        if (model.user_id != undefined) {
            query += `user_id = ?, `
            values.push(model.user_id)
        }
        query += `updated_at = ? where id = ?`
        const updated_at = new Date()
        values.push(updated_at)
        values.push(id)
        const result = await database.executeQuery(query, values);
        if ((result as any).affectedRows === 0)
            return new HttpException(400, errorMessages.UPDATE_FAILED);
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

        if (key != undefined) {
            query += ` and name like '%${key}%'`
            countQuery += ` and name like '%${key}%'`
        }
        if (model.status != undefined) {
            query += ` and status = ${model.status}`
            countQuery += ` and status = ${model.status}`
        }
        if (model.branch_id != undefined) {
            query += ` and branch_id = ${model.branch_id}`
            countQuery += ` and branch_id = ${model.branch_id}`
        }
        if (model.customer_id != undefined) {
            query += ` and customer_id = ${model.customer_id}`
            countQuery += ` and customer_id = ${model.customer_id}`
        }
        if (model.employee_id != undefined) {
            query += ` and employee_id = ${model.employee_id}`
            countQuery += ` and employee_id = ${model.employee_id}`
        }
        if (model.service_id != undefined) {
            query += ` and service_id = ${model.service_id}`
            countQuery += ` and service_id = ${model.service_id}`
        }
        if (model.user_id != undefined) {
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
    public checkIn = async (model: CreateDto, id: number) => {
        const date = new Date()
        let query = `update ${this.tableName} set check_in_time = ?, status = ? where id = ?`;
        //status 1 check in thanh cong
        const values = [date, 1, id];
        const result = await database.executeQuery(query, values);

        if ((result as any).affectedRows === 0)
            return new HttpException(400, errorMessages.CHECK_IN_FAILED)

        let serviceRequest: ServiceRequest = {
            customer_id: model.customer_id,
            // khong chon nhan vien
            // employee_id: model.employee_id,
            service_id: model.service_id,
            status: 1, // status pending
            check_in_time: date,
            serving_at: date,
            user_id: model.user_id,
            branch_id: model.branch_id
        }
        const resultServiceRequest = await this.serviceRequestService.create(serviceRequest)
        if (resultServiceRequest instanceof HttpException) { return new HttpException(400, errorMessages.CREATE_SERVICE_REQUEST_FAILED) }
        return {
            data: {
                id: id,
                check_in_time: date,
                status: 1
            }
        }
    }
}