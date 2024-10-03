"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationMiddleware = (req, res, next) => {
    const page = parseInt(req.query.page, 1) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    if (req.query.filters) {
        const filters = JSON.parse(req.query.filters);
        req.pagination = { page, limit, filters };
        next();
    }
    else {
        req.pagination = { page, limit };
        next();
    }
};
exports.default = paginationMiddleware;
//# sourceMappingURL=pagination.middleware.js.map