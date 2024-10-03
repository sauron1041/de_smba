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
exports.CustomerController = void 0;
const utils_1 = require("@core/utils");
const constants_1 = __importDefault(require("@core/config/constants"));
const services_1 = require("services");
class CustomerController {
    constructor() {
        this.customerController = new services_1.CustomerService();
        this.findById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const result = yield this.customerController.findById(id);
                if (result instanceof Error)
                    return (0, utils_1.sendResponse)(res, result.status, result.message);
                return (0, utils_1.sendResponse)(res, 200, constants_1.default.FIND_BY_ID_SUCCESS, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.searchs = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const name = req.query.name;
            const key = req.query.key;
            const status = req.query.status;
            const page = req.query.page;
            const limit = req.query.limit;
            const phone = req.query.phone;
            const email = req.query.email;
            const loyalty_points = req.query.loyalty_points;
            const model = {
                name: name,
                status: status,
                phone: phone,
                email: email,
                loyalty_points: loyalty_points
            };
            let pageInt = parseInt(page);
            let limitInt = parseInt(limit);
            try {
                const result = yield this.customerController.searchs(key, pageInt, limitInt, model);
                if (result instanceof Error)
                    return (0, utils_1.sendResponse)(res, result.status, result.message);
                return (0, utils_1.sendResponse)(res, 200, constants_1.default.FIND_ALL_SUCCESS, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.updatestatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const result = yield this.customerController.updateStatus(id);
                if (result instanceof Error)
                    return (0, utils_1.sendResponse)(res, result.status, result.message);
                return (0, utils_1.sendResponse)(res, 200, constants_1.default.UPDATE_SUCCESS);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const listId = req.body.listId;
            try {
                const result = yield this.customerController.deleteList(listId);
                if (result instanceof Error)
                    return (0, utils_1.sendResponse)(res, result.status, result.message);
                return (0, utils_1.sendResponse)(res, 200, constants_1.default.DELETE_SUCCESS, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateListstatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const listId = req.body.listId;
            const status = req.body.status;
            try {
                const result = yield this.customerController.updateListStatus(listId, status);
                if (result instanceof Error)
                    return (0, utils_1.sendResponse)(res, result.status, result.message);
                return (0, utils_1.sendResponse)(res, 200, constants_1.default.UPDATE_SUCCESS, result);
            }
            catch (error) {
                next(error);
            }
        });
        this.createAppointment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const model = req.body;
            model.user_id = req.id;
            try {
                const result = yield this.customerController.createAppointment(model);
                if (result instanceof Error)
                    return (0, utils_1.sendResponse)(res, result.status, result.message);
                return (0, utils_1.sendResponse)(res, 200, constants_1.default.CREATE_SUCCESS, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.CustomerController = CustomerController;
//# sourceMappingURL=customer.controller.js.map