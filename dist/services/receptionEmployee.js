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
exports.ReceptionEmployeeService = void 0;
const database_1 = __importDefault(require("@core/config/database"));
const exceptions_1 = require("@core/exceptions");
const checkExist_1 = require("@core/utils/checkExist");
const constants_1 = __importDefault(require("@core/config/constants"));
const appointment_service_1 = require("./appointment.service");
const serviceRequest_service_1 = require("./serviceRequest.service");
const availableEmployee_service_1 = require("./availableEmployee.service");
const pubSub_1 = __importDefault(require("@core/pubSub/pubSub"));
const queueService_1 = require("./queueService");
class ReceptionEmployeeService {
    constructor() {
        this.tableNameAppointment = 'appointment';
        this.fieldId = 'id';
        this.appointmentService = new appointment_service_1.AppointmentService();
        this.serviceRequestService = new serviceRequest_service_1.ServiceRequestService();
        this.availableEmployeeService = new availableEmployee_service_1.AvailableEmployeeService();
        this.queueService = new queueService_1.QueueService();
        this.acceptAppointment = (appointment_id, status) => __awaiter(this, void 0, void 0, function* () {
            const checkExistAppointment = yield (0, checkExist_1.checkExist)(this.tableNameAppointment, this.fieldId, appointment_id.toString());
            if (!checkExistAppointment)
                return new exceptions_1.HttpException(400, constants_1.default.NOT_FOUND);
            const nowDate = "2024-09-19";
            let query = `update ${this.tableNameAppointment} set status = ? where id = ?`;
            // let query = `update ${this.tableNameAppointment} set status = ? where id = ? and date = ?`;
            // status 2: accept thanh cong 3: accept that bai
            const values = [status, appointment_id];
            console.log(values);
            console.log(query);
            const result = yield database_1.default.executeQuery(query, values);
            console.log(result);
            if (result.affectedRows === 0)
                return new exceptions_1.HttpException(400, constants_1.default.ACCEPT_CHECK_IN_FAILED);
            if (status == 3) {
                return new exceptions_1.HttpException(400, constants_1.default.CANCEL_CHECK_IN_SUCCESS);
            }
            let checkInTime = checkExistAppointment[0].check_in_time;
            // add customer to queue
            let serviceRequest = {
                customer_id: checkExistAppointment[0].customer_id,
                // khong chon nhan vien
                employee_id: checkExistAppointment[0].employee_id,
                service_id: checkExistAppointment[0].service_id,
                status: 1, // status pending
                check_in_time: (checkInTime != undefined) ? checkInTime : new Date(),
                user_id: checkExistAppointment[0].user_id,
                branch_id: checkExistAppointment[0].branch_id
            };
            const resultServiceRequest = yield this.serviceRequestService.create(serviceRequest);
            if (resultServiceRequest instanceof exceptions_1.HttpException) {
                return new exceptions_1.HttpException(400, constants_1.default.CREATE_SERVICE_REQUEST_FAILED);
            }
            pubSub_1.default.emit('acceptAppointment', appointment_id, checkInTime, 2, (resultServiceRequest.data) ? resultServiceRequest.data : null);
            return {
                data: {
                    id: appointment_id,
                    check_in_time: checkInTime,
                    status: 2,
                    serviceRequest: (resultServiceRequest.data) ? resultServiceRequest.data : null
                }
            };
        });
        this.findAllQueueByBranchAndStatus = (branch_id, status) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.serviceRequestService.findQueueByBranchAndStatus(branch_id, status);
            if (result instanceof exceptions_1.HttpException) {
                return new exceptions_1.HttpException(400, constants_1.default.NOT_FOUND);
            }
            return {
                data: result.data
            };
        });
        this.findAllEmployeeWithCondition = (model) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.availableEmployeeService.findAllEmployeeWithCondition(model);
            if (result instanceof exceptions_1.HttpException) {
                return new exceptions_1.HttpException(400, constants_1.default.NOT_FOUND);
            }
            return {
                data: result.data
            };
        });
        this.listenToEvent = () => __awaiter(this, void 0, void 0, function* () {
            pubSub_1.default.on('appStarted', (appointment_id, checkInTime, status, serviceRequest) => __awaiter(this, void 0, void 0, function* () {
                try {
                }
                catch (error) {
                }
            }));
            // eventEmitter.on('acceptAppointment', async (appointment_id: number, checkInTime: Date, status: number, serviceRequest: ServiceRequest) => {
            //     try {
            //         console.log('acceptAppointment', appointment_id, checkInTime, status, serviceRequest);
            //     } catch (error) {
            //     }
            // })
        });
        this.listenToEvent();
        this.queueService = this.queueService;
    }
}
exports.ReceptionEmployeeService = ReceptionEmployeeService;
//# sourceMappingURL=receptionEmployee.js.map