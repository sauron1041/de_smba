import database from "@core/config/database";
import { CreateDto } from "dtos/service/create.dto";
import { HttpException } from "@core/exceptions";
import { checkExist } from "@core/utils/checkExist";
import { IPagiantion } from "@core/interfaces";
import { RowDataPacket } from "mysql2";
import errorMessages from "@core/config/constants";
import { SerivceSkillService } from "./serviceSkill.service";

class ServiceService {
    private tableName = 'service';
    private fieldId = 'id'
    private fieldName = 'name'
    private serviceSkillService = new SerivceSkillService();

    public create = async (model: CreateDto) => {
        if (await checkExist(this.tableName, this.fieldName, model.name!.toString()))
            return new HttpException(400, errorMessages.NAME_EXIST, this.fieldName);
        const created_at = new Date()
        const updated_at = new Date()
        let query = `insert into ${this.tableName} (name, description, price, status, branch_id, total_sessions, user_id, created_at, updated_at, service_package_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const result = await database.executeQuery(query, [
            model.name || null,
            model.description || null,
            model.price || null,
            model.status || null,
            model.branch_id || null,
            model.total_sessions || 10,
            model.user_id || null,
            created_at,
            updated_at,
            model.service_package_id || null
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
        if (model.name != undefined) {
            if (await checkExist(this.tableName, this.fieldName, model.name!, id.toString()))
                return new HttpException(400, errorMessages.NAME_EXIST, this.fieldName);
        }
        let query = `update ${this.tableName} set `;
        let values = [];
        if (model.name != undefined) {
            query += `name = ?, `
            values.push(model.name || null)
        }
        if (model.description != undefined) {
            query += `description = ?, `
            values.push(model.description || null)
        }
        if (model.price != undefined) {
            query += `price = ?, `
            values.push(model.price || null)
        }
        if (model.status != undefined) {
            query += `status = ?, `
            values.push(model.status || null)
        }
        if (model.branch_id != undefined) {
            query += `branch_id = ?, `
            values.push(model.branch_id || null)
        }
        if (model.total_sessions != undefined) {
            query += `total_sessions = ?, `
            values.push(model.total_sessions || null)
        }
        if (model.user_id != undefined) {
            query += `user_id = ?, `
            values.push(model.user_id)
        }
        if (model.service_package_id != undefined) {
            query += `service_package_id = ?, `
            values.push(model.service_package_id || null)
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
        let query = `select s.* from ${this.tableName} s left join service_package sp on sp.id = s.service_package_id where 1=1 `;
        let countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} s left join service_package sp on sp.id = s.service_package_id WHERE 1=1`;
        let values = [];

        if (key != undefined) {
            query += ` (s.name like ? or service_package_name like ? or s.description like ? or s.price like ?)`
            countQuery += ` (s.name like ? or service_package_name like ? or s.description like ? or s.price like ?)`
            values.push(key, key, key, key)
        }
        if (model.name != undefined) {
            query += ` and s.name like ?`;
            countQuery += ` and s.name like ?`;
            values.push(`%${model.name}%`);
        }
        if (model.price != undefined) {
            query += ` and s.price = ?`
            countQuery += ` and s.price = ?`
            values.push(model.price)
        }
        if (model.status != undefined) {
            query += ` and s.status = ?`
            countQuery += ` and s.status = ?`
            values.push(model.status)
        }
        if (model.branch_id != undefined) {
            query += ` and s.branch_id = ?`
            countQuery += ` and s.branch_id = ?`
            values.push(model.branch_id)
        }
        if (model.total_sessions != undefined) {
            query += ` and s.total_sessions = ?`
            countQuery += ` and s.total_sessions = ?`
            values.push(model.total_sessions)
        }
        if (model.user_id != undefined) {
            query += ` and s.user_id = ?`
            countQuery += ` and s.user_id = ?`
            values.push(model.user_id)
        }
        if (model.service_package_id != undefined) {
            query += ` and s.service_package_id = ?`
            countQuery += ` and s.service_package_id = ?`
            values.push(model.service_package_id)
        }
        query += ` order by s.id desc`
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
        console.log("query", query);
        console.log("values", values);



        const count = await database.executeQuery(countQuery, values);
        const totalPages = Math.ceil((count as RowDataPacket[])[0].total / limit);
        if (Array.isArray(count) && count.length > 0)
            pagination.totalPage = totalPages
        const result = await database.executeQuery(query, values);
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
    public findAllSerivceWithSkill = async (model: CreateDto) => {
        let query = `select * from ${this.tableName} where 1=1`;
        let values = [];
        if (model.branch_id != undefined) {
            query += ` and branch_id = ?`
            values.push(model.branch_id)
        }
        if (model.user_id != undefined) {
            query += ` and user_id = ?`
            values.push(model.user_id)
        }
        if (model.service_package_id != undefined) {
            query += ` and service_package_id = ?`
            values.push(model.service_package_id)
        }
        if (model.status != undefined) {
            query += ` and status = ?`
            values.push(model.status)
        }
        if (model.total_sessions != undefined) {
            query += ` and total_sessions = ?`
            values.push(model.total_sessions)
        }
        if (model.name != undefined) {
            query += ` and name like '%${model.name}%'`
        }
        if (model.id != undefined) {
            query += ` and id = ?`
            values.push(model.id)
        }
        query += ` order by id desc`
        const result = await database.executeQuery(query, values);
        console.log(result);

        if ((result as RowDataPacket[]).length === 0)
            return new HttpException(404, errorMessages.NOT_FOUND)
        for (let i = 0; i < (result as RowDataPacket[]).length; i++) {
            const skill = await this.serviceSkillService.findAllSkillByServiceId((result as RowDataPacket[])[i].id);
            if (result instanceof HttpException) { }
            (result as RowDataPacket[])[i].skills = (skill as RowDataPacket).data;
        }
        return {
            data: result
        }
    }
}

export default ServiceService;