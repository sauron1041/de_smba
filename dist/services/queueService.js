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
exports.QueueService = void 0;
const database_1 = __importDefault(require("@core/config/database"));
const exceptions_1 = require("@core/exceptions");
const checkExist_1 = require("@core/utils/checkExist");
const constants_1 = __importDefault(require("@core/config/constants"));
const customer_service_1 = require("./customer.service");
const availableEmployee_service_1 = require("./availableEmployee.service");
const serviceRequest_service_1 = require("./serviceRequest.service");
const employeeService_service_1 = require("./employeeService.service");
const pubSub_1 = __importDefault(require("@core/pubSub/pubSub"));
class QueueService {
    constructor() {
        this.tableName = 'service_request';
        this.fieldId = 'id';
        this.customerService = new customer_service_1.CustomerService();
        this.availableEmployeeService = new availableEmployee_service_1.AvailableEmployeeService();
        this.serviceRequestService = new serviceRequest_service_1.ServiceRequestService();
        this.employeeService = new employeeService_service_1.EmployeeService();
        this.addCustomerToQueue = (model) => __awaiter(this, void 0, void 0, function* () {
            const created_at = new Date();
            const updated_at = new Date();
            const checkCustomer = yield this.customerService.findById(model.customer_id);
            if (checkCustomer instanceof exceptions_1.HttpException)
                return new exceptions_1.HttpException(400, constants_1.default.NOT_EXISTED, 'customer_id');
            const checkService = yield database_1.default.executeQuery(`select * from ${this.tableName} where id = ?`, [model.service_id]);
            if (checkService.length === 0)
                return new exceptions_1.HttpException(400, constants_1.default.NOT_EXISTED, 'service_id');
            let query = `insert into ${this.tableName} (status, check_in_time, service_id, user_id, updated_at) values (?, ?, ?, ?, ?)`;
            let values = [model.status || 0, model.check_in_time || new Date(), model.service_id, model.user_id, updated_at];
            const result = yield database_1.default.executeQuery(query, values);
            if (result.affectedRows === 0)
                return new exceptions_1.HttpException(400, constants_1.default.CREATE_FAILED);
            return {
                data: Object.assign(Object.assign({ id: result.insertId }, model), { created_at: created_at, updated_at: updated_at })
            };
        });
        this.updateCustomerInQueue = (id, model) => __awaiter(this, void 0, void 0, function* () {
            if (!(yield (0, checkExist_1.checkExist)(this.tableName, this.fieldId, id.toString())))
                return new exceptions_1.HttpException(400, constants_1.default.NOT_EXISTED, this.fieldId);
            let query = `update ${this.tableName} set `;
            let values = [];
            if (model.service_id != undefined) {
                query += `service_id = '${model.service_id}', `;
                values.push(model.service_id);
            }
            if (model.status != undefined) {
                query += `status = '${model.status}', `;
                values.push(model.status || null);
            }
            if (model.user_id != undefined) {
                query += `user_id = '${model.user_id}', `;
                values.push(model.user_id);
            }
            if (model.check_in_time != undefined) {
                query += `check_in_time = '${model.check_in_time}', `;
                values.push(model.check_in_time);
            }
            if (model.serving_at != undefined) {
                query += `serving_at = '${model.serving_at}', `;
                values.push(model.serving_at);
            }
            if (model.completed_at != undefined) {
                query += `completed_at = '${model.completed_at}', `;
                values.push(model.completed_at);
            }
            // if(model.cancel_at != undefined){
            //     query += `cancel_at = '${model.cancel_at}', `
            //     values.push(model.cancel_at)
            // }
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
            if (key && key.length != undefined) {
                query += ` and name like '%${key}%'`;
                countQuery += ` and name like '%${key}%'`;
            }
            if (model.status != undefined) {
                query += ` and status = ${model.status}`;
                countQuery += ` and status = ${model.status}`;
            }
            if (model.check_in_time != undefined) {
                query += ` and check_in_time = ${model.check_in_time}`;
                countQuery += ` and check_in_time = ${model.check_in_time}`;
            }
            if (model.service_id != undefined) {
                query += ` and service_id = ${model.service_id}`;
                countQuery += ` and service_id = ${model.service_id}`;
            }
            if (model.user_id != undefined) {
                query += ` and user_id = ${model.user_id}`;
                countQuery += ` and user_id = ${model.user_id}`;
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
        this.findAllCustomerOrderByCheckInTime = () => __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.default.executeQuery(`select * from ${this.tableName} where status = 1 order by check_in_time asc`);
            if (result.length === 0)
                return new exceptions_1.HttpException(404, constants_1.default.NOT_FOUND);
            return {
                data: result
            };
        });
        // public handlePendingCustomer = async (service_id: number) => {
        //     const checkAvailableTechnicanSkill = await this.serviceSkillsService.findEmployeeByStatus(service_id, 1);
        //     if (checkAvailableTechnicanSkill.length == 0)
        //         return new HttpException(400, errorMessages.NO_TECHNICAN_AVAILABLE)
        //     return {
        //         data: checkAvailableTechnicanSkill
        //     }
        // }
        this.handlePendingCustomer = (service_id) => __awaiter(this, void 0, void 0, function* () {
            // const checkServiceSkill = await this.availableEmployeeService.findEmployeeWithSkillsByEmployeeId(service_id);
            // if ((checkServiceSkill as RowDataPacket).length == 0) {
            //     return new HttpException(400, errorMessages.NO_TECHNICAN_AVAILABLE)
            // }
            // if ((checkServiceSkill as RowDataPacket).length > 0) {
            //     if ((checkServiceSkill as RowDataPacket)[0].status == 0) {
            //         return new HttpException(400, errorMessages.NO_TECHNICAN_AVAILABLE)
            //     }
            //     else if ((checkServiceSkill as RowDataPacket)[0].status == 1) {
            //         // return {
            //         //     data: checkServiceSkill
            //         // }
            //         // const handle
            //     }
            // }
            const result = yield this.serviceRequestService.update({ status: 2 }, service_id);
            if (result instanceof exceptions_1.HttpException)
                return new exceptions_1.HttpException(400, constants_1.default.UPDATE_FAILED);
            return {
                data: result
            };
        });
        this.hanleCompletedCustomer = (service_id) => __awaiter(this, void 0, void 0, function* () {
            const update_at = new Date();
            const result = yield this.serviceRequestService.update({ status: 3, completed_at: update_at }, service_id);
            if (result instanceof exceptions_1.HttpException)
                return new exceptions_1.HttpException(400, constants_1.default.UPDATE_FAILED);
            return {
                data: result
            };
        });
        this.handleCancelCustomer = (service_id) => __awaiter(this, void 0, void 0, function* () {
            const update_at = new Date();
            const result = yield this.serviceRequestService.update({ status: 5, completed_at: update_at }, service_id);
            if (result instanceof exceptions_1.HttpException)
                return new exceptions_1.HttpException(400, constants_1.default.UPDATE_FAILED);
            return {
                data: result
            };
        });
        this.handleServingCustomer = (service_id) => __awaiter(this, void 0, void 0, function* () {
            const update_at = new Date();
            const result = yield this.serviceRequestService.update({ status: 2, serving_at: update_at }, service_id);
            if (result instanceof exceptions_1.HttpException)
                return new exceptions_1.HttpException(400, constants_1.default.UPDATE_FAILED);
            return {
                data: result
            };
        });
        this.handleCheckinCustomer = (service_id) => __awaiter(this, void 0, void 0, function* () {
            const update_at = new Date();
            const result = yield this.serviceRequestService.update({ status: 1, check_in_time: update_at }, service_id);
            if (result instanceof exceptions_1.HttpException)
                return new exceptions_1.HttpException(400, constants_1.default.UPDATE_FAILED);
            return {
                data: result
            };
        });
        this.handleQueueCustomer = () => __awaiter(this, void 0, void 0, function* () {
            const checkServiceRequest = yield this.serviceRequestService.findServiceByStatus(2);
            for (let i = 0; i < checkServiceRequest.data.length; i++) {
                const checkServiceSkill = yield this.availableEmployeeService.findEmployeeByStatus(checkServiceRequest.data[i].service_id, 1);
                if (checkServiceSkill.length == 0) {
                    return new exceptions_1.HttpException(400, constants_1.default.NO_TECHNICAN_AVAILABLE);
                }
                if (checkServiceSkill.length > 0) {
                    if (checkServiceSkill[0].status == 0) {
                        return new exceptions_1.HttpException(400, constants_1.default.NO_TECHNICAN_AVAILABLE);
                    }
                    else if (checkServiceSkill[0].status == 1) {
                        const result = yield this.serviceRequestService.update({ status: 3 }, checkServiceRequest.data[i].id);
                        if (result instanceof exceptions_1.HttpException)
                            return new exceptions_1.HttpException(400, constants_1.default.UPDATE_FAILED);
                    }
                }
            }
        });
        // 2024-09-15
        this.findFirstQueuePending = (model) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.serviceRequestService.findAllQueueByConditions({
                branch_id: model.branch_id || 1, // vi du 1
                status: 1 // pending
            });
            if (result instanceof exceptions_1.HttpException)
                return new exceptions_1.HttpException(400, constants_1.default.NOT_FOUND);
            return {
                data: result.data[0]
            };
        });
        this.listenToEvent = () => __awaiter(this, void 0, void 0, function* () {
            pubSub_1.default.on('updateStatusServiceRequestCompleted', (branch_id) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // const serviceRequest = await this.findFirstQueuePending({ branch_id: 1 });
                    const listCustomer = yield this.serviceRequestService.findAllQueueByConditions({
                        branch_id: branch_id !== null && branch_id !== void 0 ? branch_id : 1,
                        status: 1 // pending
                    });
                    const serviceLastest = listCustomer.data[0];
                    console.log("findAll", listCustomer);
                    for (let i = 0; i < listCustomer.data.length; i++) {
                        const customer = listCustomer.data[i];
                        // tim nhan vien co skill phu hop
                        const employee = yield this.employeeService.findEmployeeWithSkillOfService(serviceLastest.service_id);
                        if (employee instanceof exceptions_1.HttpException) {
                            console.log("employee not found");
                        }
                        // kiem tra xem nhan vien nao dang free
                        const placeholders = employee.data.map(() => '?').join(',');
                        let queryEmployeeAvailable = `SELECT * FROM available_employee WHERE employee_id IN (${placeholders}) AND is_available = ? ORDER BY updated_at ASC`;
                        const employeeValues = [...employee.data, 1];
                        const resultEmployeeAvailable = yield database_1.default.executeQuery(queryEmployeeAvailable, employeeValues);
                        let query = `update ${this.tableName} set status = ?, serving_at = ?, employee_id = ? where id = ?`;
                        const update_at = new Date();
                        const values = [2, update_at, resultEmployeeAvailable[0].employee_id, listCustomer.data[i].id];
                        console.log("values", values);
                        const resultUpdateServing = yield database_1.default.executeQuery(query, values);
                        if (customer.affectedRows === 0)
                            return new exceptions_1.HttpException(400, constants_1.default.UPDATE_FAILED);
                        // set trang thai nhan vien ve busy
                        let queryEmployee = `update available_employee set is_available = ? where employee_id = ?`;
                        let valuesEmployee = [2, resultEmployeeAvailable[0].employee_id];
                        const resultUpdateEmployee = yield database_1.default.executeQuery(queryEmployee, valuesEmployee);
                        if (resultUpdateEmployee.affectedRows === 0)
                            return new exceptions_1.HttpException(400, constants_1.default.UPDATE_FAILED);
                        // if ((listCustomer as RowDataPacket).data.length > 0) {
                        //     eventEmitterInstance.emit('acceptAppointment', appointment_id, checkInTime, 2, (serviceRequest as RowDataPacket).data)
                        // }
                    }
                }
                catch (error) {
                }
            }));
            pubSub_1.default.on('acceptAppointment', (appointment_id, checkInTime, status, serviceRequest) => __awaiter(this, void 0, void 0, function* () {
                console.log("acceptAppointment", appointment_id, checkInTime, status, serviceRequest);
                try {
                    const listCustomer = yield this.serviceRequestService.findAllQueueByConditions({
                        branch_id: serviceRequest.branch_id,
                        status: 1 // pending
                    });
                    console.log("findAll", listCustomer);
                    for (let i = 0; i < listCustomer.data.length; i++) {
                        const customer = listCustomer.data[i];
                        // tim nhan vien co skill phu hop
                        const employee = yield this.employeeService.findEmployeeWithSkillOfService(serviceRequest.service_id);
                        if (employee instanceof exceptions_1.HttpException) {
                            console.log("employee not found");
                        }
                        // kiem tra xem nhan vien nao dang free
                        const placeholders = employee.data.map(() => '?').join(',');
                        let queryEmployeeAvailable = `SELECT * FROM available_employee WHERE employee_id IN (${placeholders}) AND is_available = ? ORDER BY updated_at ASC`;
                        const employeeValues = [...employee.data, 1];
                        const resultEmployeeAvailable = yield database_1.default.executeQuery(queryEmployeeAvailable, employeeValues);
                        let query = `update ${this.tableName} set status = ?, serving_at = ?, employee_id = ? where id = ?`;
                        const update_at = new Date();
                        const values = [2, update_at, resultEmployeeAvailable[0].employee_id, listCustomer.data[i].id];
                        console.log("values", values);
                        const resultUpdateServing = yield database_1.default.executeQuery(query, values);
                        if (customer.affectedRows === 0)
                            return new exceptions_1.HttpException(400, constants_1.default.UPDATE_FAILED);
                        // set trang thai nhan vien ve busy
                        let queryEmployee = `update available_employee set is_available = ? where employee_id = ?`;
                        let valuesEmployee = [2, resultEmployeeAvailable[0].employee_id];
                        const resultUpdateEmployee = yield database_1.default.executeQuery(queryEmployee, valuesEmployee);
                        if (resultUpdateEmployee.affectedRows === 0)
                            return new exceptions_1.HttpException(400, constants_1.default.UPDATE_FAILED);
                        if (listCustomer.data.length > 0) {
                            pubSub_1.default.emit('acceptAppointment', appointment_id, checkInTime, 2, serviceRequest.data);
                        }
                    }
                }
                catch (error) {
                }
            }));
        });
        this.listenToEvent();
    }
}
exports.QueueService = QueueService;
//# sourceMappingURL=queueService.js.map