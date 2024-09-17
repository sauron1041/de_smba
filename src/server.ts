require('module-alias/register');
require('dotenv').config();
import App from "./app"
import validateEnv from "@core/utils/validate_env";
import 'reflect-metadata';
import { IndexRoute, serviceSkillRoute } from "routes";
import { AuthRoute } from "routes";
import { UserRoute } from "routes";
import { ServiceRoute } from "routes";
import { SessionRoute } from "routes";
import { SessionTrackingRoute } from "routes";
import { SkillRoute } from "routes";
import { AppointmentRoute } from "routes";
import { AvailableEmployeeRoute } from "routes";
import { ServiceRequestRoute } from "routes";
import { ServicePackageRoute } from "routes";
import { CustomerRoute } from "routes";
import { ReceptionEmployeeRoute } from "routes/receptionEmployee.route";
import { EmployeeRoute } from "routes/employee.route";
import { EmployeeSkillRoute } from "routes";

validateEnv();
const routes = [
    new IndexRoute(),
    new UserRoute(),
    new AuthRoute(),
    new ServicePackageRoute(),
    new ServiceRoute(),
    new SessionRoute(),
    new SessionTrackingRoute(),
    new SkillRoute(),
    new serviceSkillRoute(),
    new AppointmentRoute(),
    new AvailableEmployeeRoute(),
    new ServiceRequestRoute(),
    new CustomerRoute(),
    new ReceptionEmployeeRoute(),
    new EmployeeRoute(),
    new EmployeeSkillRoute(),
];

const app = new App(routes);

app.listen();