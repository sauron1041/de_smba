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
const database_1 = __importDefault(require("@core/config/database"));
const exceptions_1 = require("@core/exceptions");
const checkExist_1 = require("@core/utils/checkExist");
const constants_1 = __importDefault(require("@core/config/constants"));
const serviceSkill_service_1 = require("./serviceSkill.service");
class ServiceService {
    constructor() {
        this.tableName = 'service';
        this.fieldId = 'id';
        this.fieldName = 'name';
        this.serviceSkillService = new serviceSkill_service_1.SerivceSkillService();
        this.create = (model) => __awaiter(this, void 0, void 0, function* () {
            if (yield (0, checkExist_1.checkExist)(this.tableName, this.fieldName, model.name.toString()))
                return new exceptions_1.HttpException(400, constants_1.default.NAME_EXIST, this.fieldName);
            const created_at = new Date();
            const updated_at = new Date();
            let query = `insert into ${this.tableName} (name, description, price, status, branch_id, total_sessions, user_id, created_at, updated_at, service_package_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const result = yield database_1.default.executeQuery(query, [
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
            if (result.affectedRows === 0)
                return new exceptions_1.HttpException(400, constants_1.default.CREATE_FAILED);
            return {
                data: Object.assign(Object.assign({ id: result.insertId }, model), { created_at: created_at, updated_at: updated_at })
            };
        });
        this.update = (model, id) => __awaiter(this, void 0, void 0, function* () {
            if (!(yield (0, checkExist_1.checkExist)(this.tableName, this.fieldId, id.toString())))
                return new exceptions_1.HttpException(400, constants_1.default.NOT_EXISTED, this.fieldId);
            if (model.name != undefined) {
                if (yield (0, checkExist_1.checkExist)(this.tableName, this.fieldName, model.name, id.toString()))
                    return new exceptions_1.HttpException(400, constants_1.default.NAME_EXIST, this.fieldName);
            }
            let query = `update ${this.tableName} set `;
            let values = [];
            if (model.name != undefined) {
                query += `name = ?, `;
                values.push(model.name || null);
            }
            if (model.description != undefined) {
                query += `description = ?, `;
                values.push(model.description || null);
            }
            if (model.price != undefined) {
                query += `price = ?, `;
                values.push(model.price || null);
            }
            if (model.status != undefined) {
                query += `status = ?, `;
                values.push(model.status || null);
            }
            if (model.branch_id != undefined) {
                query += `branch_id = ?, `;
                values.push(model.branch_id || null);
            }
            if (model.total_sessions != undefined) {
                query += `total_sessions = ?, `;
                values.push(model.total_sessions || null);
            }
            if (model.user_id != undefined) {
                query += `user_id = ?, `;
                values.push(model.user_id);
            }
            if (model.service_package_id != undefined) {
                query += `service_package_id = ?, `;
                values.push(model.service_package_id || null);
            }
            query += `updated_at = ? where id = ?`;
            console.log(query);
            console.log(values);
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
            let query = `select s.* from ${this.tableName} s left join service_package sp on sp.id = s.service_package_id where 1=1 `;
            let countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} s left join service_package sp on sp.id = s.service_package_id WHERE 1=1`;
            let values = [];
            if (key != undefined) {
                query += ` (s.name like ? or service_package_name like ? or s.description like ? or s.price like ?)`;
                countQuery += ` (s.name like ? or service_package_name like ? or s.description like ? or s.price like ?)`;
                values.push(key, key, key, key);
            }
            if (model.name != undefined) {
                query += ` and s.name like ?`;
                countQuery += ` and s.name like ?`;
                values.push(`%${model.name}%`);
            }
            if (model.price != undefined) {
                query += ` and s.price = ?`;
                countQuery += ` and s.price = ?`;
                values.push(model.price);
            }
            if (model.status != undefined) {
                query += ` and s.status = ?`;
                countQuery += ` and s.status = ?`;
                values.push(model.status);
            }
            if (model.branch_id != undefined) {
                query += ` and s.branch_id = ?`;
                countQuery += ` and s.branch_id = ?`;
                values.push(model.branch_id);
            }
            if (model.total_sessions != undefined) {
                query += ` and s.total_sessions = ?`;
                countQuery += ` and s.total_sessions = ?`;
                values.push(model.total_sessions);
            }
            if (model.user_id != undefined) {
                query += ` and s.user_id = ?`;
                countQuery += ` and s.user_id = ?`;
                values.push(model.user_id);
            }
            if (model.service_package_id != undefined) {
                query += ` and s.service_package_id = ?`;
                countQuery += ` and s.service_package_id = ?`;
                values.push(model.service_package_id);
            }
            query += ` order by s.id desc`;
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
            console.log("query", query);
            console.log("values", values);
            const count = yield database_1.default.executeQuery(countQuery, values);
            const totalPages = Math.ceil(count[0].total / limit);
            if (Array.isArray(count) && count.length > 0)
                pagination.totalPage = totalPages;
            const result = yield database_1.default.executeQuery(query, values);
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
        this.findAllSerivceWithSkill = (model) => __awaiter(this, void 0, void 0, function* () {
            let query = `select * from ${this.tableName} where 1=1`;
            let values = [];
            if (model.branch_id != undefined) {
                query += ` and branch_id = ?`;
                values.push(model.branch_id);
            }
            if (model.user_id != undefined) {
                query += ` and user_id = ?`;
                values.push(model.user_id);
            }
            if (model.service_package_id != undefined) {
                query += ` and service_package_id = ?`;
                values.push(model.service_package_id);
            }
            if (model.status != undefined) {
                query += ` and status = ?`;
                values.push(model.status);
            }
            if (model.total_sessions != undefined) {
                query += ` and total_sessions = ?`;
                values.push(model.total_sessions);
            }
            if (model.name != undefined) {
                query += ` and name like '%${model.name}%'`;
            }
            if (model.id != undefined) {
                query += ` and id = ?`;
                values.push(model.id);
            }
            query += ` order by id desc`;
            const result = yield database_1.default.executeQuery(query, values);
            console.log(result);
            if (result.length === 0)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
            for (let i = 0; i < result.length; i++) {
                const skill = yield this.serviceSkillService.findAllSkillByServiceId(result[i].id);
                if (result instanceof exceptions_1.HttpException) { }
                result[i].skills = skill.data;
            }
            return {
                data: result
            };
        });
    }
}
exports.default = ServiceService;
//# sourceMappingURL=service.service.js.map