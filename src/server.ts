require('module-alias/register');
require('dotenv').config();
import App from "./app"
import validateEnv from "@core/utils/validate_env";
import 'reflect-metadata';
import { IndexRoute } from "routes";
import { AuthRoute } from "routes";
import { UserRoute } from "routes";
import { ServiceRoute } from "routes";
import { SessionRoute } from "routes";
import { SessionTrackingRoute } from "routes";
import { addCustomerToQueue, serveCustomer, completeService } from "services/queue.service";
import { Customer } from "interfaces/customer.interface";

validateEnv();

const routes = [
    new IndexRoute(),
    new UserRoute(),
    new AuthRoute(),
    new ServiceRoute(),
    new SessionRoute(),
    new SessionTrackingRoute()

];

const app = new App(routes);

let customer1: any = new Customer(1, 'Thuan');
let customer2: any = new Customer(2, 'Yen Nhi');

addCustomerToQueue(customer1);
addCustomerToQueue(customer2);

serveCustomer();
completeService(2, 1);

app.listen();