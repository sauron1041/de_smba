"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePackageRoute = void 0;
const express_1 = require("express");
const servicePackage_controller_1 = require("controllers/servicePackage.controller");
const middleware_1 = require("@core/middleware");
class ServicePackageRoute {
    constructor() {
        this.path = '/service-packages';
        this.router = (0, express_1.Router)();
        this.serivcePackageRoute = new servicePackage_controller_1.ServicePackageController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/', middleware_1.AuthMiddleware.authorization, this.serivcePackageRoute.create);
        this.router.get(this.path + '/', this.serivcePackageRoute.searchs);
        this.router.delete(this.path + '/delete-list', middleware_1.AuthMiddleware.authorization, this.serivcePackageRoute.deleteList);
        this.router.put(this.path + '/update-list-status', middleware_1.AuthMiddleware.authorization, this.serivcePackageRoute.updateListstatus);
        this.router.put(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.serivcePackageRoute.update);
        this.router.delete(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.serivcePackageRoute.delete);
        this.router.get(this.path + '/findById/:id', middleware_1.AuthMiddleware.authorization, this.serivcePackageRoute.findById);
        this.router.put(this.path + '/update-status/:id', middleware_1.AuthMiddleware.authorization, this.serivcePackageRoute.updatestatus);
    }
}
exports.ServicePackageRoute = ServicePackageRoute;
//# sourceMappingURL=servicePackage.route.js.map