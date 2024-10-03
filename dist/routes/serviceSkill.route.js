"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceSkillRoute = void 0;
const express_1 = require("express");
const middleware_1 = require("@core/middleware");
const controllers_1 = require("controllers");
const create_dto_1 = require("dtos/serviceSkill/create.dto");
class serviceSkillRoute {
    constructor() {
        this.path = '/service-skills';
        this.router = (0, express_1.Router)();
        this.serviceskillRoute = new controllers_1.ServiceSkillController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/', (0, middleware_1.errorMiddleware)(create_dto_1.CreateDto, 'body', false), middleware_1.AuthMiddleware.authorization, this.serviceskillRoute.create);
        this.router.get(this.path + '/', middleware_1.AuthMiddleware.authorization, this.serviceskillRoute.searchs);
        this.router.delete(this.path + '/delete-list', middleware_1.AuthMiddleware.authorization, this.serviceskillRoute.deleteList);
        this.router.put(this.path + '/update-list-status', middleware_1.AuthMiddleware.authorization, this.serviceskillRoute.updateListstatus);
        this.router.put(this.path + '/:id', (0, middleware_1.errorMiddleware)(create_dto_1.CreateDto, 'body', false), middleware_1.AuthMiddleware.authorization, this.serviceskillRoute.update);
        this.router.delete(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.serviceskillRoute.delete);
        this.router.get(this.path + '/findById/:id', middleware_1.AuthMiddleware.authorization, this.serviceskillRoute.findById);
        this.router.put(this.path + '/update-status/:id', middleware_1.AuthMiddleware.authorization, this.serviceskillRoute.updatestatus);
    }
}
exports.serviceSkillRoute = serviceSkillRoute;
//# sourceMappingURL=serviceSkill.route.js.map