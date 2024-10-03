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
exports.SkillService = void 0;
const database_1 = __importDefault(require("@core/config/database"));
const exceptions_1 = require("@core/exceptions");
const checkExist_1 = require("@core/utils/checkExist");
const constants_1 = __importDefault(require("@core/config/constants"));
class SkillService {
    constructor() {
        this.tableName = 'skill';
        this.fieldId = 'id';
        this.fieldName = 'name';
        this.create = (model) => __awaiter(this, void 0, void 0, function* () {
            if (yield (0, checkExist_1.checkExist)(this.tableName, this.fieldName, model.name.toString()))
                return new exceptions_1.HttpException(400, constants_1.default.NAME_EXIST, this.fieldName);
            const created_at = new Date();
            const updated_at = new Date();
            let query = `insert into ${this.tableName} (name, description, level, category, status, employee_id, user_id, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const result = yield database_1.default.executeQuery(query, [
                model.name,
                model.description || null,
                model.level || 1,
                model.category || null,
                model.status || 1,
                model.employee_id || null,
                model.user_id,
                created_at,
                updated_at
            ]);
            if (result.affectedRows === 0)
                return new exceptions_1.HttpException(400, constants_1.default.CREATE_FAILED);
            return {
                data: Object.assign(Object.assign({ id: result.insertId }, model), { created_at: created_at, updated_at: updated_at })
            };
        });
        this.update = (model, id) => __awaiter(this, void 0, void 0, function* () {
            if (!(yield (0, checkExist_1.checkExist)(this.tableName, this.fieldId, id.toString())))
                return new exceptions_1.HttpException(400, constants_1.default.EXISTED, this.fieldId);
            if (yield (0, checkExist_1.checkExist)(this.tableName, this.fieldName, model.name, id.toString()))
                return new exceptions_1.HttpException(400, constants_1.default.NAME_EXIST, this.fieldName);
            let query = `update ${this.tableName} set `;
            let values = [];
            if (model.name != undefined) {
                query += `name = ?, `;
                values.push(model.name || null);
            }
            if (model.status != undefined) {
                query += `status = ?, `;
                values.push(model.status || null);
            }
            if (model.user_id != undefined) {
                query += `user_id = ?, `;
                values.push(model.user_id);
            }
            if (model.description != undefined) {
                query += `description = ?, `;
                values.push(model.description || null);
            }
            if (model.level != undefined) {
                query += `level = ?, `;
                values.push(model.level || null);
            }
            if (model.category != undefined) {
                query += `category = ?, `;
                values.push(model.category || null);
            }
            if (model.employee_id != undefined) {
                query += `employee_id = ?, `;
                values.push(model.employee_id || null);
            }
            query += `updated_at = ? where id = ?`;
            const updated_at = new Date();
            values.push(updated_at);
            values.push(id);
            const result = yield database_1.default.executeQuery(query, values);
            if (result.affectedRows === 0)
                return new exceptions_1.HttpException(400, constants_1.default.UPDATE_FAILED);
            return {
                data: Object.assign(Object.assign({ id: id }, model), { updated_at: updated_at })
            };
        });
        this.delete = (id) => __awaiter(this, void 0, void 0, function* () {
            if (!(yield (0, checkExist_1.checkExist)(this.tableName, this.fieldId, id.toString())))
                return new exceptions_1.HttpException(400, constants_1.default.EXISTED);
            const result = yield database_1.default.executeQuery(`delete from ${this.tableName} where id = ?`, [id]);
            if (result.affectedRows === 0)
                return new exceptions_1.HttpException(400, constants_1.default.DELETE_FAILED);
            return {
                message: constants_1.default.DELETE_SUCCESS,
            };
        });
        this.findById = (id) => __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, checkExist_1.checkExist)(this.tableName, this.fieldId, id.toString());
            if (result == false)
                return new exceptions_1.HttpException(400, constants_1.default.NOT_EXISTED);
            return {
                data: result[0]
            };
        });
        this.searchs = (key, page, limit, model) => __awaiter(this, void 0, void 0, function* () {
            let query = `select * from ${this.tableName} where 1=1`;
            let countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE 1=1`;
            if (key != undefined) {
                query += ` and name like '%${key}%'`;
                countQuery += ` and name like '%${key}%'`;
            }
            if (model.name != undefined) {
                query += ` and name like '%${model.name}%'`;
                countQuery += ` and name like '%${model.name}%'`;
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
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
            return {
                data: result,
                pagination: pagination
            };
        });
        this.updateStatus = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = null;
                let status = 0;
                const update_at = new Date();
                const getStatus = yield database_1.default.executeQuery(`select status from ${this.tableName} where id = ?`, [id]);
                if (getStatus.length === 0)
                    return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
                if (getStatus[0].status == 0) {
                    status = 1;
                    result = yield database_1.default.executeQuery(`update ${this.tableName} set status = ?, updated_at = ? where id = ?`, [status, update_at, id]);
                }
                if (getStatus[0].status == 1) {
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
        this.deleteList = (data) => __awaiter(this, void 0, void 0, function* () {
            let query = `delete from ${this.tableName} where id in (${data})`;
            const result = yield database_1.default.executeQuery(query);
            if (result.affectedRows === 0)
                return new exceptions_1.HttpException(400, constants_1.default.DELETE_FAILED);
            return {
                message: constants_1.default.DELETE_SUCCESS
            };
        });
        this.updateListStatus = (data, status) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = null;
                const update_at = new Date();
                let query = `update ${this.tableName} set status = ?, updated_at = ? where id in (${data})`;
                result = yield database_1.default.executeQuery(query, [status, update_at]);
                return {
                    data: {
                        status: status,
                        updated_at: update_at
                    }
                };
            }
            catch (error) {
                return new exceptions_1.HttpException(500, constants_1.default.UPDATE_FAILED);
            }
        });
        this.findAllSkillByEmployeeId = (employee_id) => __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.default.executeQuery(`select * from ${this.tableName} where employee_id = ?`, [employee_id]);
            console.log(result);
            if (Array.isArray(result) && result.length === 0)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
            return {
                data: result
            };
        });
    }
}
exports.SkillService = SkillService;
//# sourceMappingURL=skill.service.js.map