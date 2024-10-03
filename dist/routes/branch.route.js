"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchRoute = void 0;
const express_1 = require("express");
const controllers_1 = require("controllers");
const middleware_1 = require("@core/middleware");
class BranchRoute {
    constructor() {
        this.path = '/branch';
        this.router = (0, express_1.Router)();
        this.branchRoute = new controllers_1.BranchController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/', middleware_1.AuthMiddleware.authorization, this.branchRoute.create);
        this.router.get(this.path + '/', middleware_1.AuthMiddleware.authorization, this.branchRoute.searchs);
        this.router.delete(this.path + '/delete-list', middleware_1.AuthMiddleware.authorization, this.branchRoute.deleteList);
        this.router.put(this.path + '/update-list-status', middleware_1.AuthMiddleware.authorization, this.branchRoute.updateListstatus);
        this.router.put(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.branchRoute.update);
        this.router.delete(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.branchRoute.delete);
        this.router.get(this.path + '/findById/:id', middleware_1.AuthMiddleware.authorization, this.branchRoute.findById);
        this.router.put(this.path + '/update-status/:id', middleware_1.AuthMiddleware.authorization, this.branchRoute.updatestatus);
    }
}
exports.BranchRoute = BranchRoute;
//# sourceMappingURL=branch.route.js.map