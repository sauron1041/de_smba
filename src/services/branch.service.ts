import database from "@core/config/database";
import { CreateDto } from "dtos/branch/create.dto";
import { HttpException } from "@core/exceptions";
import { checkExist } from "@core/utils/checkExist";
import { IPagiantion } from "@core/interfaces";
import { RowDataPacket } from "mysql2";
import errorMessages from "@core/config/constants";

export class BranchService {
    private tableName = 'branch';
    private fieldId = 'id'
    private fieldName = 'name'

    public create = async (model: CreateDto) => {
        if (await checkExist(this.tableName, this.fieldName, model.name!.toString()))
            return new HttpException(400, errorMessages.NAME_EXIST, this.fieldName);
        const created_at = new Date()
        const updated_at = new Date()
        let query = `insert into ${this.tableName} (name, status, address, phone, email, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?)`;
        const result = await database.executeQuery(query, [
            model.name || null,
            model.status || 1,
            model.address || null,
            model.phone || null,
            model.email || null,
            created_at,
            updated_at,
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
            return new HttpException(400, errorMessages.NOT_EXISTED, this.fieldId);
        if (await checkExist(this.tableName, this.fieldName, model.name!, id.toString()))
            return new HttpException(400, errorMessages.NAME_EXIST, this.fieldName);
        let query = `update ${this.tableName} set `;
        let values = [];
        if (model.name != undefined) {
            query += `name = ?, `
            values.push(model.name || null)
        }
        if (model.status != undefined) {
            query += `status = ?, `
            values.push(model.status || null)
        }
        if (model.address != undefined) {
            query += `address = ?, `
            values.push(model.address || null)
        }
        if (model.phone != undefined) {
            query += `phone = ?, `
            values.push(model.phone || null)
        }
        if (model.email != undefined) {
            query += `email = ?, `
            values.push(model.email || null)
        }
        query += `updated_at = ? where id = ?`
        console.log(query);
        console.log(values);
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
            query += ` and name like '%${key}%' or address like '%${key}%' or phone like '%${key}%' or email like '%${key}%'`
            countQuery += ` and name like '%${key}%' or address like '%${key}%' or phone like '%${key}%' or email like '%${key}%'`
        }
        if (model.status != undefined) {
            query += ` and status = ?`
            countQuery += ` and status = ?`
        }
        if (model.name != undefined) {
            query += ` and name like '%${model.name}%'`
            countQuery += ` and name like '%${model.name}%'`
        }
        if (model.address != undefined) {
            query += ` and address like '%${model.address}%'`
            countQuery += ` and address like '%${model.address}%'`
        }
        if (model.phone != undefined) {
            query += ` and phone like '%${model.phone}%'`
            countQuery += ` and phone like '%${model.phone}%'`
        }
        if (model.email != undefined) {
            query += ` and email like '%${model.email}%'`
            countQuery += ` and email like '%${model.email}%'`
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