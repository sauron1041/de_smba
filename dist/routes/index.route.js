"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("controllers");
class IndexRoute {
    constructor() {
        this.path = '/';
        this.router = (0, express_1.Router)();
        this.indexController = new controllers_1.IndexController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.indexController.index);
    }
}
exports.default = IndexRoute;
//# sourceMappingURL=index.route.js.map