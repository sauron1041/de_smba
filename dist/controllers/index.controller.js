"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@core/utils");
class IndexController {
    constructor() {
        this.index = (req, res, next) => {
            try {
                (0, utils_1.sendResponse)(res, 200, "Welcome to Server");
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = IndexController;
//# sourceMappingURL=index.controller.js.map