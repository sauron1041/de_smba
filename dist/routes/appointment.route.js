"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("controllers");
const middleware_1 = require("@core/middleware");
class AppointmentRoute {
    constructor() {
        this.path = '/appointments';
        this.router = (0, express_1.Router)();
        this.appointmentRoute = new controllers_1.AppointmentController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/', middleware_1.AuthMiddleware.authorization, this.appointmentRoute.create);
        this.router.get(this.path + '/', middleware_1.AuthMiddleware.authorization, this.appointmentRoute.searchs);
        this.router.delete(this.path + '/delete-list', middleware_1.AuthMiddleware.authorization, this.appointmentRoute.deleteList);
        this.router.put(this.path + '/update-list-status', middleware_1.AuthMiddleware.authorization, this.appointmentRoute.updateListstatus);
        this.router.put(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.appointmentRoute.update);
        this.router.delete(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.appointmentRoute.delete);
        this.router.get(this.path + '/findById/:id', middleware_1.AuthMiddleware.authorization, this.appointmentRoute.findById);
        this.router.put(this.path + '/update-status/:id', middleware_1.AuthMiddleware.authorization, this.appointmentRoute.updatestatus);
    }
}
exports.AppointmentRoute = AppointmentRoute;
//# sourceMappingURL=appointment.route.js.map