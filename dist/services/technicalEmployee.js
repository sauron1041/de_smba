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
exports.TechnicalEmployeeService = void 0;
const database_1 = __importDefault(require("@core/config/database"));
const exceptions_1 = require("@core/exceptions");
const checkExist_1 = require("@core/utils/checkExist");
const constants_1 = __importDefault(require("@core/config/constants"));
const appointment_service_1 = require("./appointment.service");
const serviceRequest_service_1 = require("./serviceRequest.service");
const availableEmployee_service_1 = require("./availableEmployee.service");
const pubSub_1 = __importDefault(require("@core/pubSub/pubSub"));
class TechnicalEmployeeService {
    constructor() {
        this.tableNameAppointment = 'appointment';
        this.fieldId = 'id';
        this.appointmentService = new appointment_service_1.AppointmentService();
        this.serviceRequestService = new serviceRequest_service_1.ServiceRequestService();
        this.availableEmployeeService = new availableEmployee_service_1.AvailableEmployeeService();
        this.updateStatusServiceRequestCompleted = (model, service_request_id) => __awaiter(this, void 0, void 0, function* () {
            // hoan thanh dich vu cho khach hang => model = 4 (completed)
            const completed_at = new Date();
            const checkExistServiceRequest = yield (0, checkExist_1.checkExist)('service_request', 'id', service_request_id.toString());
            if (!checkExistServiceRequest)
                return new exceptions_1.HttpException(400, constants_1.default.NOT_FOUND);
            let query = `update service_request set status = ? , completed_at = ? where id = ?`;
            const values = [4, completed_at, service_request_id];
            const result = yield database_1.default.executeQuery(query, values);
            console.log("result", result);
            //set lai status cua nhan vien free => status = 1
            let queryEmployeeStatus = `update available_employee set is_available = ? where employee_id = ?`;
            const branch = yield database_1.default.executeQuery("select * from available_employee where employee_id = " + model.employee_id);
            if (branch instanceof exceptions_1.HttpException) { }
            const branch_id = branch[0].branch_id;
            console.log(branch_id);
            const valuesEmployeeStatus = [1, model.employee_id];
            const resultEmployeeStatus = yield database_1.default.executeQuery(queryEmployeeStatus, valuesEmployeeStatus);
            console.log("resultEmployeeStatus nahn vien ", resultEmployeeStatus);
            pubSub_1.default.emit('updateStatusServiceRequestCompleted', branch_id ? branch_id : null);
            if (result.affectedRows === 0)
                return new exceptions_1.HttpException(400, constants_1.default.UPDATE_FAILED);
            return {
                data: {
                    id: service_request_id,
                    status: model.status,
                }
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
        this.listenToEvent = () => {
            pubSub_1.default.on('acceptAppointment', () => { });
            // eventEmitterInstance.on('updateStatusServiceRequestCompleted', this.updateStatusServiceRequestCompleted)
        };
        this.listenToEvent();
    }
}
exports.TechnicalEmployeeService = TechnicalEmployeeService;
//# sourceMappingURL=technicalEmployee.js.map