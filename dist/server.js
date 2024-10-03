"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias/register');
require('dotenv').config();
const app_1 = __importDefault(require("./app"));
const validate_env_1 = __importDefault(require("@core/utils/validate_env"));
require("reflect-metadata");
const routes_1 = require("routes");
const routes_2 = require("routes");
const routes_3 = require("routes");
const routes_4 = require("routes");
const routes_5 = require("routes");
const routes_6 = require("routes");
const routes_7 = require("routes");
const routes_8 = require("routes");
const routes_9 = require("routes");
const routes_10 = require("routes");
const routes_11 = require("routes");
const routes_12 = require("routes");
const receptionEmployee_route_1 = require("routes/receptionEmployee.route");
const employee_route_1 = require("routes/employee.route");
const routes_13 = require("routes");
const routes_14 = require("routes");
const routes_15 = require("routes");
(0, validate_env_1.default)();
const routes = [
    new routes_1.IndexRoute(),
    new routes_3.UserRoute(),
    new routes_2.AuthRoute(),
    new routes_11.ServicePackageRoute(),
    new routes_4.ServiceRoute(),
    new routes_5.SessionRoute(),
    new routes_6.SessionTrackingRoute(),
    new routes_7.SkillRoute(),
    new routes_1.serviceSkillRoute(),
    new routes_8.AppointmentRoute(),
    new routes_9.AvailableEmployeeRoute(),
    new routes_10.ServiceRequestRoute(),
    new routes_12.CustomerRoute(),
    new receptionEmployee_route_1.ReceptionEmployeeRoute(),
    new employee_route_1.EmployeeRoute(),
    new routes_13.EmployeeSkillRoute(),
    new routes_14.TechnicalEmployeeRoute(),
    new routes_15.BranchRoute()
];
const app = new app_1.default(routes);
app.listen();
//# sourceMappingURL=server.js.map