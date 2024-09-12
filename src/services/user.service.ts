import { HttpException } from "@core/exceptions";
import bcryptjs from 'bcryptjs';
import database from "@core/config/database";
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { RowDataPacket } from "mysql2/promise";
import mysql from "mysql2/promise";
import { Create } from "../dtos/user/create.dto";
import { IPagiantion } from "@core/interfaces";
import { checkExist } from "@core/utils/checkExist";
import errorMessages from "@core/config/constants";

class UserServices {
    private tableName = 'users';

    public updatestatus = async (id: number) => {
        try {
            let result = null;
            let status = 0
            const update_at = new Date()
            const getstatus = await database.executeQuery(`select status from ${this.tableName} where id = ?`, [id]);
            if ((getstatus as RowDataPacket[]).length === 0)
                return new HttpException(404, errorMessages.NOT_FOUND);
            if ((getstatus as RowDataPacket[])[0].status == 0) {
                status = 1
                result = await database.executeQuery(`update ${this.tableName} set status = ?, updated_at = ? where id = ?`, [status, update_at, id]);
            }
            if ((getstatus as RowDataPacket[])[0].status == 1) {
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
    public create = async (model: Create) => {
        if (await checkExist(this.tableName, 'username', model.username!))
            return new HttpException(400, errorMessages.USERNAME_EXISTED, 'username');
        try {
            const hashedPassword = await bcryptjs.hash(model.password!, 10);
            const created_at = new Date()
            const updated_at = new Date()
            let query = `INSERT INTO ${this.tableName} (username, password, name, email, phone, gender, loyalty_points, avatar, status, role, token, user_id, created_at, updated_at) VALUES (?, ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)`;
            let values = [
                model.username,
                hashedPassword,
                model.name || null,
                model.email || null,
                model.phone || null,
                model.gender || 2,
                model.loyalty_points || 0,
                model.avatar || null,
                model.status || null,
                model.role || 1,
                model.token || null,
                model.user_id || null,
                created_at,
                updated_at
            ];
            const result = await database.executeQuery(query, values);
            if ((result as mysql.ResultSetHeader).affectedRows === 0)
                return new HttpException(500, errorMessages.CREATE_FAILED);
            return {
                data: {
                    id: (result as mysql.ResultSetHeader).insertId,
                    ...model,
                    created_at: created_at,
                    updated_at: updated_at
                }
            }
        } catch (error) {
            return new HttpException(500, errorMessages.CREATE_FAILED);
        }
    }
    public delete = async (id: number) => {
        const check = await checkExist(this.tableName, 'id', id.toString());
        if (!check)
            return new HttpException(404, errorMessages.NOT_FOUND, 'id');
        const result = await database.executeQuery(`delete from users where id = ?`, [id]);
        if ((result as any).affectedRows === 0)
            return new HttpException(400, errorMessages.DELETE_FAILED);
        return {
            data: {
                message: errorMessages.DELETE_SUCCESS
            }
        }
    }
    public getOne = async (id: number) => {
        const result = await checkExist(this.tableName, 'id', id.toString());
        if (result == false)
            return new HttpException(404, errorMessages.NOT_FOUND, 'id');
        delete (result as RowDataPacket[])[0].password;
        delete (result as RowDataPacket[])[0].token;
        return {
            data: {
                ...(result as RowDataPacket[])[0]
            }
        };
    }

    public searchs = async (key: string, model: Create, page: number, limit: number) => {
        let query = `select * from ${this.tableName} where 1=1`;
        let countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE 1=1`;

        if (key && key.length != 0) {
            query += ` and (username like '%${key}%' or name like '%${key}%' or phone like '%${key}%' or email like '%${key}%')`
            countQuery += ` and (username like '%${key}%' or name like '%${key}%' or phone like '%${key}%' or email like '%${key}%')`
        }
        if (model.username != undefined) {
            query += ` and username like '%${model.username}%'`
            countQuery += ` and username like '%${model.username}%'`
        }
        if (model.name != undefined) {
            query += ` and name like '%${model.name}%'`
            countQuery += ` and name like '%${model.name}%'`
        }
        if (model.phone != undefined) {
            query += ` and phone like '%${model.phone}%'`
            countQuery += ` and phone like '%${model.phone}%'`
        }
        if (model.email != undefined) {
            query += ` and email like '%${model.email}%'`
            countQuery += ` and email like '%${model.email}%'`
        }
        if (model.status != undefined) {
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
            return new HttpException(400, errorMessages.FIND_ALL_FAILED);
        (result as RowDataPacket[]).forEach((row) => {
            delete row.password;
            delete row.token
        });
        return {
            data: result,
            pagination: pagination
        }
    }
    public updateProfile = async (model: Create, id: number) => {
        const check = await checkExist(this.tableName, 'id', id.toString());
        if (check === false)
            return new HttpException(404, errorMessages.NOT_FOUND, 'id');
        let query = `UPDATE ${this.tableName} SET `;
        let values = [];
        if (model.email != undefined) {
            query += `email = ?,`
            values.push(model.email)
        }
        if (model.name != undefined) {
            query += `name = ?,`
            values.push(model.name)
        }
        if (model.phone != undefined) {
            query += `phone = ?,`
            values.push(model.phone)
        }
        if (model.status != undefined) {
            query += `status = ?,`
            values.push(model.status)
        }
        const updated_at = new Date();
        query += `updated_at = ? WHERE id = ?`
        values.push(updated_at)
        values.push(id)
        try {
            const result = await database.executeQuery(query, values);
            if ((result as mysql.ResultSetHeader).affectedRows === 0)
                return new HttpException(400, errorMessages.UPDATE_FAILED);
            return {
                data: {
                    id: id,
                    ...model,
                    updated_at: updated_at
                }
            }
        } catch (error) {
            return new HttpException(500, errorMessages.UPDATE_FAILED);
        }

    }
}

export default UserServices;