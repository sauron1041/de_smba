"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillRoute = void 0;
const express_1 = require("express");
const middleware_1 = require("@core/middleware");
const controllers_1 = require("controllers");
const create_dto_1 = require("dtos/skill/create.dto");
class SkillRoute {
    constructor() {
        this.path = '/skills';
        this.router = (0, express_1.Router)();
        this.skillRoute = new controllers_1.SkillController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/', (0, middleware_1.errorMiddleware)(create_dto_1.CreateDto, 'body', false), middleware_1.AuthMiddleware.authorization, this.skillRoute.create);
        this.router.get(this.path + '/', middleware_1.AuthMiddleware.authorization, this.skillRoute.searchs);
        this.router.delete(this.path + '/delete-list', middleware_1.AuthMiddleware.authorization, this.skillRoute.deleteList);
        this.router.put(this.path + '/update-list-status', middleware_1.AuthMiddleware.authorization, this.skillRoute.updateListstatus);
        this.router.put(this.path + '/:id', (0, middleware_1.errorMiddleware)(create_dto_1.CreateDto, 'body', false), middleware_1.AuthMiddleware.authorization, this.skillRoute.update);
        this.router.delete(this.path + '/:id', middleware_1.AuthMiddleware.authorization, this.skillRoute.delete);
        this.router.get(this.path + '/findById/:id', middleware_1.AuthMiddleware.authorization, this.skillRoute.findById);
        this.router.put(this.path + '/update-status/:id', middleware_1.AuthMiddleware.authorization, this.skillRoute.updatestatus);
    }
}
exports.SkillRoute = SkillRoute;
//# sourceMappingURL=skill.route.js.map