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
const logger_1 = __importDefault(require("@core/utils/logger"));
const promise_1 = __importDefault(require("mysql2/promise"));
class Database {
    constructor() {
        this.pool = null;
    }
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_CONNECTION_LIMIT, DB_PORT } = process.env;
            try {
                this.pool = promise_1.default.createPool({
                    host: DB_HOST,
                    user: DB_USER,
                    port: DB_PORT ? parseInt(DB_PORT) : 3306,
                    password: DB_PASSWORD,
                    database: DB_NAME,
                    waitForConnections: true,
                    // connectionLimit: DB_CONNECTION_LIMIT ? parseInt(DB_CONNECTION_LIMIT) : 10,
                    connectTimeout: 60000,
                    queueLimit: 0,
                    // ssl: {
                    //     ca: fs.readFileSync(path.resolve(__dirname, "../../../ca.pem"))
                    // }
                });
                yield this.getConnection();
                logger_1.default.info("Connected to DB successfully");
            }
            catch (error) {
                logger_1.default.error("Failed to connect to DB", error);
                throw error;
            }
        });
    }
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pool)
                return yield this.pool.getConnection();
            throw new Error("get connection failed");
        });
    }
    closeConnection(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (connection) {
                    connection.release();
                }
            }
            catch (error) {
                logger_1.default.error("close connection failed");
                throw error;
            }
        });
    }
    executeQuery(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = null;
            try {
                connection = yield this.getConnection();
                const [results] = yield connection.execute(query, params);
                return results;
            }
            catch (error) {
                logger_1.default.error("execute query failed", error);
                throw error;
            }
            finally {
                if (connection) {
                    yield this.closeConnection(connection);
                }
            }
        });
    }
    query(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = null;
            try {
                connection = yield this.getConnection();
                const [results] = yield connection.query(query, params);
                return results;
            }
            catch (error) {
                logger_1.default.error("query failed");
                throw error;
            }
            finally {
                if (connection) {
                    yield this.closeConnection(connection);
                }
            }
        });
    }
    queryOne(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = null;
            try {
                connection = yield this.getConnection();
                const result = yield connection.query(query, params);
                return result;
            }
            catch (error) {
                logger_1.default.error("query one failed");
                throw error;
            }
            finally {
                if (connection) {
                    yield this.closeConnection(connection);
                }
            }
        });
    }
}
exports.default = new Database();
//# sourceMappingURL=database.js.map