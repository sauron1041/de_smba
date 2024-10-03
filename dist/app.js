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
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const error_middleware_1 = __importDefault(require("@core/middleware/error.middleware"));
const logger_1 = __importDefault(require("@core/utils/logger"));
const path_1 = __importDefault(require("path"));
const multer = require('multer');
const database_1 = __importDefault(require("@core/config/database"));
const pubSub_1 = __importDefault(require("@core/pubSub/pubSub"));
class App {
    constructor(routes) {
        this.production = process.env.NODE_ENV === 'production' ? true : false;
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || 3001;
        this.connectMySql();
        this.initialMiddlewares();
        this.initialRoutes(routes);
        this.initialErrorMidlleware();
        this.eventEmitter();
    }
    initialRoutes(routes) {
        return __awaiter(this, void 0, void 0, function* () {
            routes.forEach(route => {
                this.app.use(process.env.API_VERSION, route.router);
            });
        });
    }
    listen() {
        if (this.production) {
        }
        else {
            this.app.listen(this.port, () => {
                logger_1.default.info(`Server is running on port ${this.port}`);
            });
        }
    }
    initialMiddlewares() {
        if (this.production) {
            this.app.use((0, morgan_1.default)('combined'));
            this.app.use((0, cors_1.default)({ origin: 'localhost:5173', credentials: true }));
            this.app.use((0, helmet_1.default)());
            this.app.use((0, hpp_1.default)());
        }
        else {
            this.app.use((0, morgan_1.default)('dev'));
            this.app.use((0, cors_1.default)({ origin: true, credentials: true }));
        }
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use('/uploads', express_1.default.static(path_1.default.resolve('uploads/')));
    }
    initialErrorMidlleware() {
        this.app.use(error_middleware_1.default);
        this.app.use(multer().single('file'));
    }
    connectMySql() {
        database_1.default.connectDB();
    }
    eventEmitter() {
        pubSub_1.default.emit('appStarted');
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map