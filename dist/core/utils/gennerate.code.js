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
exports.generateCode = generateCode;
exports.generateCodeRandom = generateCodeRandom;
exports.gennerateCodeRandomWithPrefix = gennerateCodeRandomWithPrefix;
exports.generateCodeWithPrefix = generateCodeWithPrefix;
const database_1 = __importDefault(require("@core/config/database"));
function generateCode(type, length) {
    return __awaiter(this, void 0, void 0, function* () {
        let key = '';
        let pre = '';
        if (type == 'customer') {
            key = 'customers';
            pre = 'KH';
        }
        if (type == 'service_package') {
            key = 'service_pack';
            pre = 'DV';
        }
        const lastRow = yield database_1.default.executeQuery(`SELECT id, code FROM ${key} ORDER BY id DESC LIMIT 1`);
        let codeNumber = '';
        if (Array.isArray(lastRow) && lastRow.length == 0) {
            codeNumber = '1'.padStart(length - pre.length, '0');
            return pre + codeNumber;
        }
        if (Array.isArray(lastRow) && lastRow.length > 0) {
            const lastCode = lastRow[0].code;
            codeNumber = lastCode.substring(pre.length);
        }
        const newCode = pre + (parseInt(codeNumber, 10) + 1).toString().padStart(length - pre.length, '0');
        return newCode;
    });
}
function generateCodeRandom(tableName, length) {
    return __awaiter(this, void 0, void 0, function* () {
        let code;
        let result;
        const query = `SELECT * FROM ${tableName} WHERE code = ?`;
        const generateCode = () => Math.random().toString(36).substring(2, 2 + length);
        do {
            code = generateCode();
            result = yield database_1.default.executeQuery(query, [code]);
        } while (Array.isArray(result) && result.length > 0);
        return code.toUpperCase();
    });
}
function gennerateCodeRandomWithPrefix(tableName, prefix, length) {
    return __awaiter(this, void 0, void 0, function* () {
        let code;
        let result;
        const query = `SELECT * FROM ${tableName} WHERE code = ?`;
        const generateCode = () => Math.random().toString(36).substring(2, 2 + length - prefix.length);
        do {
            code = prefix + generateCode();
            result = yield database_1.default.executeQuery(query, [code]);
        } while (Array.isArray(result) && result.length > 0);
        return code.toUpperCase();
    });
}
function generateCodeWithPrefix(tableName, prefix, length) {
    return __awaiter(this, void 0, void 0, function* () {
        let key = '';
        let result = '';
        const query = `select * from ${tableName} where \`code\` like '${prefix}%' and \`code\` regexp '[0-9]$' order by \`code\` desc limit 1`;
        const lastRow = yield database_1.default.executeQuery(query);
        ;
        if (Array.isArray(lastRow) && lastRow.length == 0) {
            result = prefix + '1'.padStart(length - prefix.length, '0');
            return result;
        }
        if (Array.isArray(lastRow) && lastRow.length > 0) {
            const lastCode = lastRow[0].code;
            const codeNumber = lastCode.substring(prefix.length);
            result = prefix + (parseInt(codeNumber, 10) + 1).toString().padStart(length - prefix.length, '0');
        }
        return result;
    });
}
//# sourceMappingURL=gennerate.code.js.map