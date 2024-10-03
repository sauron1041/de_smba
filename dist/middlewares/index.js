"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMiddleware = exports.AuthMiddleware = void 0;
const auth_middleware_1 = __importDefault(require("./auth.middleware"));
exports.AuthMiddleware = auth_middleware_1.default;
const auth_middleware_2 = __importDefault(require("./auth.middleware"));
exports.UserMiddleware = auth_middleware_2.default;
//# sourceMappingURL=index.js.map