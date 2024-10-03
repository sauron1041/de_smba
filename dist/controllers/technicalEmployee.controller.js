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
exports.TechnicalEmployeeController = void 0;
const utils_1 = require("@core/utils");
const constants_1 = __importDefault(require("@core/config/constants"));
const services_1 = require("services");
class TechnicalEmployeeController {
    constructor() {
        this.technicalEmployeeController = new services_1.TechnicalEmployeeService();
        this.updateStatusServiceRequestCompleted = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const model = req.body;
            const id = req.params.id;
            try {
                const result = yield this.technicalEmployeeController.updateStatusServiceRequestCompleted(model, id);
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
    }
}
exports.TechnicalEmployeeController = TechnicalEmployeeController;
//# sourceMappingURL=technicalEmployee.controller.js.map