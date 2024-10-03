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
const exceptions_1 = require("@core/exceptions");
const database_1 = __importDefault(require("@core/config/database"));
const mapIdToObj = (sql, data, fieldNameId) => __awaiter(void 0, void 0, void 0, function* () {
    const mapId = data.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        let id = parseInt(item[fieldNameId]);
        let rs = yield database_1.default.executeQuery(sql, [id]);
        if (Array.isArray(rs) && rs.length === 0)
            return new exceptions_1.HttpException(400, 'Không tìm thấy dữ liệu');
        return rs[0];
    }));
    const details = yield Promise.all(mapId);
    if (Array.isArray(data) && data.length > 0) {
        data.forEach((item, index) => {
            item[fieldNameId] = details[index];
        });
    }
    return data;
});
exports.default = mapIdToObj;
//# sourceMappingURL=mapIdToObj.js.map