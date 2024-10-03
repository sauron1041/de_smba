"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.paginationMiddleware = exports.AuthMiddleware = void 0;
const pagination_middleware_1 = __importDefault(require("./pagination.middleware"));
exports.paginationMiddleware = pagination_middleware_1.default;
const validation_middleware_1 = __importDefault(require("./validation.middleware"));
exports.errorMiddleware = validation_middleware_1.default;
const auth_middleware_1 = __importDefault(require("./auth.middleware"));
exports.AuthMiddleware = auth_middleware_1.default;
//# sourceMappingURL=index.js.map