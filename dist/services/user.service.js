"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("@core/exceptions");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("@core/config/database"));
const checkExist_1 = require("@core/utils/checkExist");
const constants_1 = __importDefault(require("@core/config/constants"));
class UserServices {
    constructor() {
        this.tableName = 'users';
        this.updatestatus = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = null;
                let status = 0;
                const update_at = new Date();
                const getstatus = yield database_1.default.executeQuery(`select status from ${this.tableName} where id = ?`, [id]);
                if (getstatus.length === 0)
                    return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
                if (getstatus[0].status == 0) {
                    status = 1;
                    result = yield database_1.default.executeQuery(`update ${this.tableName} set status = ?, updated_at = ? where id = ?`, [status, update_at, id]);
                }
                if (getstatus[0].status == 1) {
                    result = yield database_1.default.executeQuery(`update ${this.tableName} set status = ?, updated_at = ? where id = ?`, [status, update_at, id]);
                }
                return {
                    data: {
                        id: id,
                        status: status,
                        updated_at: update_at
                    }
                };
            }
            catch (error) {
                return new exceptions_1.HttpException(500, constants_1.default.UPDATE_FAILED);
            }
        });
        this.create = (model) => __awaiter(this, void 0, void 0, function* () {
            if (yield (0, checkExist_1.checkExist)(this.tableName, 'username', model.username))
                return new exceptions_1.HttpException(400, constants_1.default.USERNAME_EXISTED, 'username');
            try {
                const hashedPassword = yield bcryptjs_1.default.hash(model.password, 10);
                const created_at = new Date();
                const updated_at = new Date();
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
                const result = yield database_1.default.executeQuery(query, values);
                if (result.affectedRows === 0)
                    return new exceptions_1.HttpException(500, constants_1.default.CREATE_FAILED);
                return {
                    data: Object.assign(Object.assign({ id: result.insertId }, model), { created_at: created_at, updated_at: updated_at })
                };
            }
            catch (error) {
                return new exceptions_1.HttpException(500, constants_1.default.CREATE_FAILED);
            }
        });
        this.delete = (id) => __awaiter(this, void 0, void 0, function* () {
            const check = yield (0, checkExist_1.checkExist)(this.tableName, 'id', id.toString());
            if (!check)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND, 'id');
            const result = yield database_1.default.executeQuery(`delete from users where id = ?`, [id]);
            if (result.affectedRows === 0)
                return new exceptions_1.HttpException(400, constants_1.default.DELETE_FAILED);
            return {
                data: {
                    message: constants_1.default.DELETE_SUCCESS
                }
            };
        });
        this.getOne = (id) => __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, checkExist_1.checkExist)(this.tableName, 'id', id.toString());
            if (result == false)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND, 'id');
            delete result[0].password;
            delete result[0].token;
            return {
                data: Object.assign({}, result[0])
            };
        });
        this.searchs = (key, model, page, limit) => __awaiter(this, void 0, void 0, function* () {
            let query = `select * from ${this.tableName} where 1=1`;
            let countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE 1=1`;
            if (key != undefined) {
                query += ` and (username like '%${key}%' or name like '%${key}%' or phone like '%${key}%' or email like '%${key}%')`;
                countQuery += ` and (username like '%${key}%' or name like '%${key}%' or phone like '%${key}%' or email like '%${key}%')`;
            }
            if (model.username != undefined) {
                query += ` and username like '%${model.username}%'`;
                countQuery += ` and username like '%${model.username}%'`;
            }
            if (model.name != undefined) {
                query += ` and name like '%${model.name}%'`;
                countQuery += ` and name like '%${model.name}%'`;
            }
            if (model.phone != undefined) {
                query += ` and phone like '%${model.phone}%'`;
                countQuery += ` and phone like '%${model.phone}%'`;
            }
            if (model.email != undefined) {
                query += ` and email like '%${model.email}%'`;
                countQuery += ` and email like '%${model.email}%'`;
            }
            if (model.status != undefined) {
                query += ` and status = ${model.status}`;
                countQuery += ` and status = ${model.status}`;
            }
            query += ` order by id desc`;
            if (limit && !page && limit > 0) {
                query = query + ` LIMIT ` + limit;
            }
            else if (page && page > 0 && limit && limit > 0) {
                query = query + ` LIMIT ` + limit + ` OFFSET ` + (page - 1) * limit;
            }
            let pagination = {
                page: page,
                limit: limit,
                totalPage: 0
            };
            const count = yield database_1.default.executeQuery(countQuery);
            const totalPages = Math.ceil(count[0].total / limit);
            if (Array.isArray(count) && count.length > 0)
                pagination.totalPage = totalPages;
            const result = yield database_1.default.executeQuery(query);
            if (Array.isArray(result) && result.length === 0)
                return new exceptions_1.HttpException(400, constants_1.default.FIND_ALL_FAILED);
            result.forEach((row) => {
                delete row.password;
                delete row.token;
            });
            return {
                data: result,
                pagination: pagination
            };
        });
        this.updateProfile = (model, id) => __awaiter(this, void 0, void 0, function* () {
            const check = yield (0, checkExist_1.checkExist)(this.tableName, 'id', id.toString());
            if (check === false)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND, 'id');
            let query = `UPDATE ${this.tableName} SET `;
            let values = [];
            if (model.email != undefined) {
                query += `email = ?,`;
                values.push(model.email);
            }
            if (model.name != undefined) {
                query += `name = ?,`;
                values.push(model.name);
            }
            if (model.phone != undefined) {
                query += `phone = ?,`;
                values.push(model.phone);
            }
            if (model.status != undefined) {
                query += `status = ?,`;
                values.push(model.status);
            }
            const updated_at = new Date();
            query += `updated_at = ? WHERE id = ?`;
            values.push(updated_at);
            values.push(id);
            try {
                const result = yield database_1.default.executeQuery(query, values);
                if (result.affectedRows === 0)
                    return new exceptions_1.HttpException(400, constants_1.default.UPDATE_FAILED);
                return {
                    data: Object.assign(Object.assign({ id: id }, model), { updated_at: updated_at })
                };
            }
            catch (error) {
                return new exceptions_1.HttpException(500, constants_1.default.UPDATE_FAILED);
            }
        });
        this.getProfileById = (id) => __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, checkExist_1.checkExist)(this.tableName, 'id', id.toString());
            if (result == false)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND, 'id');
            delete result[0].password;
            delete result[0].token;
            return {
                data: result[0]
            };
        });
    }
}
exports.default = UserServices;
//# sourceMappingURL=user.service.js.map