import database from "@core/config/database";
import { CreateDto } from "dtos/serviceRequest/create.dto";
import { HttpException } from "@core/exceptions";
import { checkExist } from "@core/utils/checkExist";
import { IPagiantion } from "@core/interfaces";
import { RowDataPacket } from "mysql2";
import errorMessages from "@core/config/constants";

export class ServiceRequestService {
    private tableName = 'service_request';
    private fieldId = 'id'

    public create = async (model: CreateDto) => {
        const created_at = new Date()
        const updated_at = new Date()
        let check_in_time = new Date()
        let query = `insert into ${this.tableName} (customer_id, employee_id, service_id, status, check_in_time, serving_at, completed_at, user_id, updated_at, branch_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let values = [model.customer_id, model.employee_id || null, model.service_id, 1, check_in_time, null, null, model.user_id, updated_at, model.branch_id || 1];
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
        console.log("model", model);
        console.log("id", id);
        
        
        if (!await checkExist(this.tableName, this.fieldId, id.toString()))
            return new HttpException(400, errorMessages.EXISTED, this.fieldId);
        let query = `update ${this.tableName} set `;
        let values = [];
        if (model.status != undefined) {
            query += `status = ${model.status}, `
            values.push(model.status)
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
        if (model.employee_id != undefined) {
            query += `employee_id = '${model.employee_id}', `
            values.push(model.employee_id)
        }
        if (model.service_id != undefined) {
            query += `service_id = '${model.service_id}', `
            values.push(model.service_id)
        }
        if (model.branch_id != undefined) {
            query += `branch_id = '${model.branch_id}', `
            values.push(model.branch_id)
        }
        query += `updated_at = ? where id = ?`
        const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        values.push(updated_at)
        values.push(id)
        console.log("query", query);
        console.log("values", values);
        
        const result = await database.executeQuery(query, values);
        console.log("result", result);
        
        if ((result as any).affectedRows === 0)
            return new HttpException(400, errorMessages.UPDATE_FAILED);
        return {
            data: {
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
    public findCustomerByStatusLastest = async (id: number, status: number) => {
        // 1 checkin, 2 pending, 3 serving, 4 complete, 5 cancle
        const query = `select * from ${this.tableName} where customer_id = ? and status = ? order by check_in_time asc`;
        const result = await database.executeQuery(query, [id, status]);
        if (Array.isArray(result) && result.length === 0)
            return new HttpException(404, errorMessages.NOT_FOUND)
        return {
            data: result
        }
    }
    public findCustomerByStatus = async (id: number, status: number) => {
        // 1 checkin, 2 pending, 3 serving, 4 complete, 5 cancle
        const result = await database.executeQuery(`select * from ${this.tableName} where customer_id = ? and status = ${status}`, [id]);
        if (Array.isArray(result) && result.length === 0)
            return new HttpException(404, errorMessages.NOT_FOUND)
        return {
            data: result
        }
    }
    public getAvailableTechnicanOfService = async (service_id: number) => {
        const query = `select * from ${this.tableName} where service_id = ? and status = 1 order by check_in_time asc`;
        const result = await database.executeQuery(query, [service_id]);
        if (Array.isArray(result) && result.length === 0)
            return new HttpException(404, errorMessages.NOT_FOUND)
        return {
            data: result
        }
    }
    public findServiceSkillByServiceId = async (service_id: number) => {
        const query = `select s.*, ss.* from service s join service_skill ss on s.id = ss.service_id where s.id = ?`;
        const result = await database.executeQuery(query, [service_id]);
        if (Array.isArray(result) && result.length === 0)
            return new HttpException(404, errorMessages.NOT_FOUND)
        return {
            data: result
        }
    }
    public findServiceByStatus = async (status: number) => {
        const query = `select * from ${this.tableName} where status = ? order by check_in_time asc`;
        const result = await database.executeQuery(query, [status]);
        if (Array.isArray(result) && result.length === 0)
            return new HttpException(404, errorMessages.NOT_FOUND)
        return {
            data: result
        }
    }
    public findQueueByBranchAndStatus = async (branch_id: number, status: number) => {
        const query = `select * from ${this.tableName} where branch_id = ? and status = ? order by check_in_time desc`;
        const result = await database.executeQuery(query, [branch_id, status]);
        if (Array.isArray(result) && result.length === 0)
            return new HttpException(404, errorMessages.NOT_FOUND)
        return {
            data: result
        }
    }
    public findAllQueueByConditions = async (model: CreateDto) => {
        let query = `select * from ${this.tableName} where 1=1`;
        if (model.status) {
            query += ` and status = ${model.status}`
        }
        if (model.branch_id) {
            query += ` and branch_id = ${model.branch_id}`
        }
        if (model.employee_id) {
            query += ` and employee_id = ${model.employee_id}`
        }
        if (model.service_id) {
            query += ` and service_id = ${model.service_id}`
        }
        if (model.check_in_time) {
            query += ` and check_in_time = ${model.check_in_time}`
        }
        if (model.serving_at) {
            query += ` and serving_at = ${model.serving_at}`
        }
        if (model.completed_at) {
            query += ` and completed_at = ${model.completed_at}`
        }
        if (model.user_id) {
            query += ` and user_id = ${model.user_id}`
        }
        if(model.customer_id){
            query += ` and customer_id = ${model.customer_id}`
        }
        query += ` order by check_in_time asc`
        const result = await database.executeQuery(query);
        if (Array.isArray(result) && result.length === 0)
            return new HttpException(404, errorMessages.NOT_FOUND)
        return {
            data: result
        }
    }
}