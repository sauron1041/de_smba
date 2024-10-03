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
exports.checkExist = void 0;
const database_1 = __importDefault(require("@core/config/database"));
const checkExist = (tableName, column, value, id) => __awaiter(void 0, void 0, void 0, function* () {
    let query = `SELECT * FROM ${tableName} WHERE ${column} = ?`;
    const params = [value];
    if (id) {
        query += ` AND id != ?`;
        params.push(id);
    }
    const checkExist = yield database_1.default.executeQuery(query, params);
    if (Array.isArray(checkExist) && checkExist.length > 0)
        return checkExist;
    return false;
});
exports.checkExist = checkExist;
//# sourceMappingURL=checkExist.js.map