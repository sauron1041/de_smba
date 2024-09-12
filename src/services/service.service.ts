import database from "@core/config/database";
import { CreateDto } from "dtos/service/create.dto";
import { HttpException } from "@core/exceptions";
import { checkExist } from "@core/utils/checkExist";
import { IPagiantion } from "@core/interfaces";
import { RowDataPacket } from "mysql2";
import errorMessages from "@core/config/constants";

class ServiceService {
    private tableName = 'service';
    private fieldId = 'id'
    private fieldName = 'name'

    public create = async (model: CreateDto) => {
        if (await checkExist(this.tableName, this.fieldName, model.name!.toString()))
            return new HttpException(400, errorMessages.NAME_EXIST, this.fieldName);
        const created_at = new Date()
        const updated_at = new Date()
        let query = `insert into ${this.tableName} (name, description, price, status, branch_id, total_sessions, user_id, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const result = await database.executeQuery(query, [
            model.name || null,
            model.description || null,
            model.price || null,
            model.status || null,
            model.branch_id || null,
            model.total_sessions || 10,
            model.user_id || null,
            created_at,
            updated_at
        ]);
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
        if (await checkExist(this.tableName, this.fieldName, model.name!, id.toString()))
            return new HttpException(400, errorMessages.NAME_EXIST, this.fieldName);
        let query = `update ${this.tableName} set `;
        let values = [];
        if (model.name != undefined) {
            query += `name = '${model.name}', `
            values.push(model.name || null)
        }
        if (model.description != undefined) {
            query += `description = '${model.description}', `
            values.push(model.description || null)
        }
        if (model.price != undefined) {
            query += `price = '${model.price}', `
            values.push(model.price || null)
        }
        if (model.status != undefined) {
            query += `status = '${model.status}', `
            values.push(model.status || null)
        }
        if (model.branch_id != undefined) {
            query += `branch_id = '${model.branch_id}', `
            values.push(model.branch_id || null)
        }
        if (model.total_sessions != undefined) {
            query += `total_sessions = '${model.total_sessions}', `
            values.push(model.total_sessions || null)
        }
        if (model.user_id != undefined) {
            query += `user_id = '${model.user_id}', `
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
        if (model.name && model.name.length != 0) {
            query += ` and name like '%${model.name}%'`
            countQuery += ` and name like '%${model.name}%'`
        }
        if (model.price) {
            query += ` and price = ${model.price}`
            countQuery += ` and price = ${model.price}`
        }
        if (model.status) {
            query += ` and status = ${model.status}`
            countQuery += ` and status = ${model.status}`
        }
        if (model.branch_id) {
            query += ` and branch_id = ${model.branch_id}`
            countQuery += ` and branch_id = ${model.branch_id}`
        }
        if (model.total_sessions) {
            query += ` and total_sessions = ${model.total_sessions}`
            countQuery += ` and total_sessions = ${model.total_sessions}`
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
}

export default ServiceService;