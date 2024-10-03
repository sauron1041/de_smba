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
exports.ReceptionEmployeeController = void 0;
const utils_1 = require("@core/utils");
const constants_1 = __importDefault(require("@core/config/constants"));
const services_1 = require("services");
class ReceptionEmployeeController {
    constructor() {
        this.receptionEmployeeController = new services_1.ReceptionEmployeeService();
        this.acceptAppointment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const status = req.body.status;
            try {
                const result = yield this.receptionEmployeeController.acceptAppointment(id, status);
                if (result instanceof Error && result.field)
                    return (0, utils_1.sendResponse)(res, result.status, result.message, null, result.field);
                if (result instanceof Error)
                    return (0, utils_1.sendResponse)(res, result.status, result.message);
                return (0, utils_1.sendResponse)(res, 200, constants_1.default.UPDATE_SUCCESS, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.findAllQueueByBranchAndStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const branch_id = req.query.branch_id;
            const status = req.query.status;
            try {
                const result = yield this.receptionEmployeeController.findAllQueueByBranchAndStatus(branch_id, status);
                if (result instanceof Error)
                    return (0, utils_1.sendResponse)(res, result.status, result.message);
                return (0, utils_1.sendResponse)(res, 200, constants_1.default.FIND_ALL_SUCCESS, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.findAllEmployeeWithCondition = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const model = req.body;
            try {
                const result = yield this.receptionEmployeeController.findAllEmployeeWithCondition(model);
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
exports.ReceptionEmployeeController = ReceptionEmployeeController;
//# sourceMappingURL=receptionEmployee.controller.js.map