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
exports.ServiceRequestService = void 0;
const database_1 = __importDefault(require("@core/config/database"));
const exceptions_1 = require("@core/exceptions");
const checkExist_1 = require("@core/utils/checkExist");
const constants_1 = __importDefault(require("@core/config/constants"));
class ServiceRequestService {
    constructor() {
        this.tableName = 'service_request';
        this.fieldId = 'id';
        this.create = (model) => __awaiter(this, void 0, void 0, function* () {
            const created_at = new Date();
            const updated_at = new Date();
            let check_in_time = new Date();
            let query = `insert into ${this.tableName} (customer_id, employee_id, service_id, status, check_in_time, serving_at, completed_at, user_id, updated_at, branch_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            let values = [model.customer_id, model.employee_id || null, model.service_id, 1, check_in_time, null, null, model.user_id, updated_at, model.branch_id || 1];
            const result = yield database_1.default.executeQuery(query, values);
            if (result.affectedRows === 0)
                return new exceptions_1.HttpException(400, constants_1.default.CREATE_FAILED);
            return {
                data: Object.assign(Object.assign({ id: result.insertId }, model), { created_at: created_at, updated_at: updated_at })
            };
        });
        this.update = (model, id) => __awaiter(this, void 0, void 0, function* () {
            console.log("model", model);
            console.log("id", id);
            if (!(yield (0, checkExist_1.checkExist)(this.tableName, this.fieldId, id.toString())))
                return new exceptions_1.HttpException(400, constants_1.default.EXISTED, this.fieldId);
            let query = `update ${this.tableName} set `;
            let values = [];
            if (model.status != undefined) {
                query += `status = ?, `;
                values.push(model.status);
            }
            if (model.user_id != undefined) {
                query += `user_id = ?, `;
                values.push(model.user_id);
            }
            if (model.check_in_time != undefined) {
                query += `check_in_time = ?, `;
                values.push(model.check_in_time);
            }
            if (model.serving_at != undefined) {
                query += `serving_at = ?, `;
                values.push(model.serving_at);
            }
            if (model.completed_at != undefined) {
                query += `completed_at = ?, `;
                values.push(model.completed_at);
            }
            if (model.employee_id != undefined) {
                query += `employee_id = ?, `;
                values.push(model.employee_id);
            }
            if (model.service_id != undefined) {
                query += `service_id = ?, `;
                values.push(model.service_id);
            }
            if (model.branch_id != undefined) {
                query += `branch_id = ?, `;
                values.push(model.branch_id);
            }
            query += `updated_at = ? where id = ?`;
            const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
            values.push(updated_at);
            values.push(id);
            console.log("query", query);
            console.log("values", values);
            const result = yield database_1.default.executeQuery(query, values);
            console.log("result", result);
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
            if (key && key.length != 0) {
                query += ` and name like '%${key}%'`;
                countQuery += ` and name like '%${key}%'`;
            }
            if (model.status) {
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
        this.findCustomerByStatusLastest = (id, status) => __awaiter(this, void 0, void 0, function* () {
            // 1 checkin, 2 pending, 3 serving, 4 complete, 5 cancle
            const query = `select * from ${this.tableName} where customer_id = ? and status = ? order by check_in_time asc`;
            const result = yield database_1.default.executeQuery(query, [id, status]);
            if (Array.isArray(result) && result.length === 0)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
            return {
                data: result
            };
        });
        this.findCustomerByStatus = (id, status) => __awaiter(this, void 0, void 0, function* () {
            // 1 checkin, 2 pending, 3 serving, 4 complete, 5 cancle
            const result = yield database_1.default.executeQuery(`select * from ${this.tableName} where customer_id = ? and status = ${status}`, [id]);
            if (Array.isArray(result) && result.length === 0)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
            return {
                data: result
            };
        });
        this.getAvailableTechnicanOfService = (service_id) => __awaiter(this, void 0, void 0, function* () {
            const query = `select * from ${this.tableName} where service_id = ? and status = 1 order by check_in_time asc`;
            const result = yield database_1.default.executeQuery(query, [service_id]);
            if (Array.isArray(result) && result.length === 0)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
            return {
                data: result
            };
        });
        this.findServiceSkillByServiceId = (service_id) => __awaiter(this, void 0, void 0, function* () {
            const query = `select s.*, ss.* from service s join service_skill ss on s.id = ss.service_id where s.id = ?`;
            const result = yield database_1.default.executeQuery(query, [service_id]);
            if (Array.isArray(result) && result.length === 0)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
            return {
                data: result
            };
        });
        this.findServiceByStatus = (status) => __awaiter(this, void 0, void 0, function* () {
            const query = `select * from ${this.tableName} where status = ? order by check_in_time asc`;
            const result = yield database_1.default.executeQuery(query, [status]);
            if (Array.isArray(result) && result.length === 0)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
            return {
                data: result
            };
        });
        this.findQueueByBranchAndStatus = (branch_id, status) => __awaiter(this, void 0, void 0, function* () {
            const query = `select * from ${this.tableName} where branch_id = ? and status = ? order by check_in_time desc`;
            const result = yield database_1.default.executeQuery(query, [branch_id, status]);
            if (Array.isArray(result) && result.length === 0)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
            return {
                data: result
            };
        });
        this.findAllQueueByConditions = (model) => __awaiter(this, void 0, void 0, function* () {
            let query = `select * from ${this.tableName} where 1=1`;
            if (model.status) {
                query += ` and status = ${model.status}`;
            }
            if (model.branch_id) {
                query += ` and branch_id = ${model.branch_id}`;
            }
            if (model.employee_id) {
                query += ` and employee_id = ${model.employee_id}`;
            }
            if (model.service_id) {
                query += ` and service_id = ${model.service_id}`;
            }
            if (model.check_in_time) {
                query += ` and check_in_time = ${model.check_in_time}`;
            }
            if (model.serving_at) {
                query += ` and serving_at = ${model.serving_at}`;
            }
            if (model.completed_at) {
                query += ` and completed_at = ${model.completed_at}`;
            }
            if (model.user_id) {
                query += ` and user_id = ${model.user_id}`;
            }
            if (model.customer_id) {
                query += ` and customer_id = ${model.customer_id}`;
            }
            query += ` order by check_in_time asc`;
            const result = yield database_1.default.executeQuery(query);
            if (Array.isArray(result) && result.length === 0)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
            return {
                data: result
            };
        });
    }
}
exports.ServiceRequestService = ServiceRequestService;
//# sourceMappingURL=serviceRequest.service.js.map