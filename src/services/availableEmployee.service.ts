import database from "@core/config/database";
import { CreateDto } from "dtos/availableEmployee/create.dto";
import { HttpException } from "@core/exceptions";
import { checkExist } from "@core/utils/checkExist";
import { IPagiantion } from "@core/interfaces";
import { RowDataPacket } from "mysql2";
import errorMessages from "@core/config/constants";
// import { SkillService } from "./skill.service";
import { EmployeeSkillService } from "./employeeSkill.service";

export class AvailableEmployeeService {
    private tableName = 'available_employee';
    private fieldId = 'id'
    // private skillService = new SkillService();
    private employeeSkillService = new EmployeeSkillService();

    public create = async (model: CreateDto) => {
        const created_at = new Date()
        const updated_at = new Date()
        let query = `insert into ${this.tableName} (employee_id, is_available, created_at, updated_at, branch_id, position_id, user_id) values (?, ?, ?, ?, ?, ?, ?)`;
        let values = [model.employee_id, model.is_available || 1, created_at, updated_at, model.branch_id || 1, model.position_id || 3, model.user_id];
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
        if (model.employee_id != undefined) {
            query += `employee_id = '${model.employee_id}', `
            values.push(model.employee_id)
        }
        if (model.is_available != undefined) {
            query += `is_available = '${model.is_available}', `
            values.push(model.is_available)
        }
        if (model.branch_id != undefined) {
            query += `branch_id = '${model.branch_id}', `
            values.push(model.branch_id)
        }
        if (model.position_id != undefined) {
            query += `position_id = '${model.position_id}', `
            values.push(model.position_id)
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
    public findEmployeeByStatus = async (id: number, status: number) => {
        const result = await database.executeQuery(`select * from ${this.tableName} where employee_id = ? and is_available = ?`, [id, status]);
        if ((result as RowDataPacket[]).length === 0)
            return new HttpException(404, errorMessages.NOT_FOUND)
        return {
            data: result
        }
    }
    public updateStatusByEmployeeId = async (id: number, status: number) => {
        try {
            let result = null;
            const update_at = new Date()
            result = await database.executeQuery(`update ${this.tableName} set is_available = ?, updated_at = ? where employee_id = ?`, [status, update_at, id]);
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
    public findAllEmployeeWithCondition = async (model: CreateDto) => {
        let query = `select * from ${this.tableName} where 1=1`;
        let values = [];
        if (model.branch_id != undefined) {
            query += ` and branch_id = ?`
            values.push(model.branch_id || 1) //set fake value
        }
        if (model.position_id != undefined) {
            query += ` and position_id = ?`
            values.push(model.position_id)
        }
        if (model.is_available != undefined) {
            query += ` and is_available = ?`
            values.push(model.is_available)
        }
        if (model.user_id != undefined) {
            query += ` and user_id = ?`
            values.push(model.user_id)
        }
        if (model.employee_id != undefined) {
            query += ` and employee_id = ?`
            values.push(model.employee_id)
        }
        query += ` order by id desc`
        const result = await database.executeQuery(query, values);
        if ((result as RowDataPacket[]).length === 0)
            return new HttpException(404, errorMessages.NOT_FOUND)
        for (let i = 0; i < (result as RowDataPacket[]).length; i++) {
            const skill = await this.employeeSkillService.findAllSkillByEmployeeId((result as RowDataPacket[])[i].employee_id);
            if (result instanceof HttpException) { }
            (result as RowDataPacket[])[i].skills = (skill as RowDataPacket).data;
        }
        return {
            data: result
        }
    }
    public findAllEmployeeWithSkill = async (model: CreateDto) => {
        let query = `select * from ${this} where 1=1`;
        let values = [];
        if (model.branch_id != undefined) {
            query += ` and branch_id = ?`
            values.push(model.branch_id)
        }
        if (model.user_id != undefined) {
            query += ` and user_id = ?`
            values.push(model.user_id)
        }
        query += ` order by id desc`
        const result = await database.executeQuery(query, values);
        console.log(result);

        if ((result as RowDataPacket[]).length === 0)
            return new HttpException(404, errorMessages.NOT_FOUND)
        for (let i = 0; i < (result as RowDataPacket[]).length; i++) {
            const skill = await this.employeeSkillService.findAllSkillByEmployeeId((result as RowDataPacket[])[i].id);
            if (result instanceof HttpException) { }
            (result as RowDataPacket[])[i].skills = (skill as RowDataPacket).data;
        }
        return {
            data: result
        }
    }
}