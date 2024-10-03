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
exports.EmployeeService = void 0;
const exceptions_1 = require("@core/exceptions");
const constants_1 = __importDefault(require("@core/config/constants"));
const appointment_service_1 = require("./appointment.service");
const serviceRequest_service_1 = require("./serviceRequest.service");
const availableEmployee_service_1 = require("./availableEmployee.service");
const serviceSkill_service_1 = require("./serviceSkill.service");
const service_service_1 = __importDefault(require("./service.service"));
const employeeSkill_service_1 = require("./employeeSkill.service");
class EmployeeService {
    constructor() {
        this.tableNameAppointment = 'appointment';
        this.fieldId = 'id';
        this.appointmentService = new appointment_service_1.AppointmentService();
        this.serviceRequestService = new serviceRequest_service_1.ServiceRequestService();
        this.availableEmployeeService = new availableEmployee_service_1.AvailableEmployeeService();
        this.serviceSkillsService = new serviceSkill_service_1.SerivceSkillService();
        this.serviceService = new service_service_1.default();
        this.employeeSkillService = new employeeSkill_service_1.EmployeeSkillService();
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
        // public findEmployeeWithSkillOfService = async (service_id: number) => {
        //     const service = await this.serviceService.findAllSerivceWithSkill({ id: service_id });
        //     let model: AvailableeEmployee = {};
        //     const employeeSkill = await this.findAllEmployeeWithSkill(model);
        //     if ((employeeSkill as RowDataPacket).data.length == 0) {
        //         return new HttpException(400, errorMessages.NOT_FOUND);
        //     }
        //     const employees = (employeeSkill as RowDataPacket).data;
        //     const services = (service as RowDataPacket).data;
        //     let result = [];
        //     // chua chinh xac
        //     for (let i = 0; i < employees.length; i++) {
        //         if (employees[i].skills && services[0].skills) {
        //             for (let j = 0; j < employees[i].skills.length; j++) {
        //                 for (let k = 0; k < services[0].skills.length; k++) {
        //                     if (employees[i].skills[j].id == services[0].skills[k].id) {
        //                             result.push(employees[i])
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     return {
        //         data: result
        //     }
        // }
        this.findEmployeeWithSkillOfService = (service_id) => __awaiter(this, void 0, void 0, function* () {
            const service = yield this.serviceService.findAllSerivceWithSkill({ id: service_id });
            console.log(service);
            let model = {};
            const employeeSkill = yield this.findAllEmployeeWithSkill(model); // thieu branch
            if (employeeSkill.data.length == 0) {
                return new exceptions_1.HttpException(400, constants_1.default.NOT_FOUND);
            }
            const SkillOfService = service.data;
            const skills = SkillOfService[0].skills;
            const listSkillIdOfService = skills.map((item) => item.skill_id);
            const employees = employeeSkill.data;
            const employeeSkillsMap = employees.reduce((acc, employee) => {
                if (!acc[employee.employee_id]) {
                    acc[employee.employee_id] = [];
                }
                if (employee.skills == null)
                    return acc;
                employee.skills.forEach((skill) => {
                    if (!acc[employee.employee_id].includes(skill.skill_id)) {
                        acc[employee.employee_id].push(skill.skill_id);
                    }
                });
                return acc;
            }, {});
            const result = Object.keys(employeeSkillsMap).reduce((acc, employeeId) => {
                const employeeSkills = employeeSkillsMap[employeeId];
                if (employeeSkills.length === 0)
                    return acc;
                const isMatch = listSkillIdOfService.every((skillId) => employeeSkills.includes(skillId));
                if (isMatch) {
                    acc.push(parseInt(employeeId));
                }
                return acc;
            }, []);
            return {
                data: result
            };
        });
        this.findAllEmployeeWithSkill = (model) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.availableEmployeeService.findAllEmployeeWithCondition(model);
            if (result instanceof exceptions_1.HttpException) {
                return new exceptions_1.HttpException(400, constants_1.default.NOT_FOUND);
            }
            return {
                data: result.data
            };
        });
    }
}
exports.EmployeeService = EmployeeService;
//# sourceMappingURL=employeeService.service.js.map