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
exports.AvailableEmployeeService = void 0;
const database_1 = __importDefault(require("@core/config/database"));
const exceptions_1 = require("@core/exceptions");
const checkExist_1 = require("@core/utils/checkExist");
const constants_1 = __importDefault(require("@core/config/constants"));
// import { SkillService } from "./skill.service";
const employeeSkill_service_1 = require("./employeeSkill.service");
class AvailableEmployeeService {
    constructor() {
        this.tableName = 'available_employee';
        this.fieldId = 'id';
        // private skillService = new SkillService();
        this.employeeSkillService = new employeeSkill_service_1.EmployeeSkillService();
        this.create = (model) => __awaiter(this, void 0, void 0, function* () {
            const created_at = new Date();
            const updated_at = new Date();
            let query = `insert into ${this.tableName} (employee_id, is_available, created_at, updated_at, branch_id, position_id, user_id) values (?, ?, ?, ?, ?, ?, ?)`;
            let values = [model.employee_id, model.is_available || 1, created_at, updated_at, model.branch_id || 1, model.position_id || 3, model.user_id];
            const result = yield database_1.default.executeQuery(query, values);
            if (result.affectedRows === 0)
                return new exceptions_1.HttpException(400, constants_1.default.CREATE_FAILED);
            return {
                data: Object.assign(Object.assign({ id: result.insertId }, model), { created_at: created_at, updated_at: updated_at })
            };
        });
        this.update = (model, id) => __awaiter(this, void 0, void 0, function* () {
            if (!(yield (0, checkExist_1.checkExist)(this.tableName, this.fieldId, id.toString())))
                return new exceptions_1.HttpException(400, constants_1.default.EXISTED, this.fieldId);
            let query = `update ${this.tableName} set `;
            let values = [];
            if (model.employee_id != undefined) {
                query += `employee_id = ?, `;
                values.push(model.employee_id);
            }
            if (model.is_available != undefined) {
                query += `is_available = ?, `;
                values.push(model.is_available);
            }
            if (model.branch_id != undefined) {
                query += `branch_id = ?, `;
                values.push(model.branch_id);
            }
            if (model.position_id != undefined) {
                query += `position_id = ?, `;
                values.push(model.position_id);
            }
            if (model.user_id != undefined) {
                query += `user_id = ?, `;
                values.push(model.user_id);
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
        this.findEmployeeByStatus = (id, status) => __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.default.executeQuery(`select * from ${this.tableName} where employee_id = ? and is_available = ?`, [id, status]);
            if (result.length === 0)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
            return {
                data: result
            };
        });
        this.updateStatusByEmployeeId = (id, status) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = null;
                const update_at = new Date();
                result = yield database_1.default.executeQuery(`update ${this.tableName} set is_available = ?, updated_at = ? where employee_id = ?`, [status, update_at, id]);
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
        this.findAllEmployeeWithCondition = (model) => __awaiter(this, void 0, void 0, function* () {
            let query = `select * from ${this.tableName} where 1=1`;
            let values = [];
            if (model.branch_id != undefined) {
                query += ` and branch_id = ?`;
                values.push(model.branch_id || 1); //set fake value
            }
            if (model.position_id != undefined) {
                query += ` and position_id = ?`;
                values.push(model.position_id);
            }
            if (model.is_available != undefined) {
                query += ` and is_available = ?`;
                values.push(model.is_available);
            }
            if (model.user_id != undefined) {
                query += ` and user_id = ?`;
                values.push(model.user_id);
            }
            if (model.employee_id != undefined) {
                query += ` and employee_id = ?`;
                values.push(model.employee_id);
            }
            query += ` order by id desc`;
            const result = yield database_1.default.executeQuery(query, values);
            if (result.length === 0)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
            for (let i = 0; i < result.length; i++) {
                const skill = yield this.employeeSkillService.findAllSkillByEmployeeId(result[i].employee_id);
                if (result instanceof exceptions_1.HttpException) { }
                result[i].skills = skill.data;
            }
            return {
                data: result
            };
        });
        this.findAllEmployeeWithSkill = (model) => __awaiter(this, void 0, void 0, function* () {
            let query = `select * from ${this} where 1=1`;
            let values = [];
            if (model.branch_id != undefined) {
                query += ` and branch_id = ?`;
                values.push(model.branch_id);
            }
            if (model.user_id != undefined) {
                query += ` and user_id = ?`;
                values.push(model.user_id);
            }
            query += ` order by id desc`;
            const result = yield database_1.default.executeQuery(query, values);
            console.log(result);
            if (result.length === 0)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
            for (let i = 0; i < result.length; i++) {
                const skill = yield this.employeeSkillService.findAllSkillByEmployeeId(result[i].id);
                if (result instanceof exceptions_1.HttpException) { }
                result[i].skills = skill.data;
            }
            return {
                data: result
            };
        });
    }
}
exports.AvailableEmployeeService = AvailableEmployeeService;
//# sourceMappingURL=availableEmployee.service.js.map