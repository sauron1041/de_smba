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
exports.EmployeeController = void 0;
const utils_1 = require("@core/utils");
const constants_1 = __importDefault(require("@core/config/constants"));
const employeeService_service_1 = require("services/employeeService.service");
class EmployeeController {
    constructor() {
        this.employeeController = new employeeService_service_1.EmployeeService();
        this.findEmployeeWithSkillOfService = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const service_id = req.params.service_id;
            try {
                const result = yield this.employeeController.findEmployeeWithSkillOfService(service_id);
                if (result instanceof Error)
                    return (0, utils_1.sendResponse)(res, result.status, result.message);
                return (0, utils_1.sendResponse)(res, 200, constants_1.default.FIND_ALL_SUCCESS, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.findAllEmployeeWithSkill = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const model = req.query;
            try {
                const result = yield this.employeeController.findAllEmployeeWithSkill(model);
                if (result instanceof Error)
                    return (0, utils_1.sendResponse)(res, result.status, result.message);
                return (0, utils_1.sendResponse)(res, 200, constants_1.default.FIND_ALL_SUCCESS, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=employee.controller.js.map