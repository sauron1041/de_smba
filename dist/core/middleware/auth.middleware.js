"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@core/utils");
class AuthMiddleware {
}
AuthMiddleware.authorization = (req, res, next) => {
    // const token = req.header('Authorization')?.replace('Bearer ', '');
    // if (!token) {
    //     return sendResponse(res, 401, 'token is required')
    // }
    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
    //     if (decoded && typeof decoded === 'object' && 'id' in decoded) {
    //         req.id = decoded.id
    //         next();
    //     } else {
    //         return sendResponse(res, 401, 'invalid token')
    //     }
    // } catch (error) {
    //     if (error instanceof Error) {
    //         return sendResponse(res, 401, error.message)
    //     } else {
    //         return sendResponse(res, 401, 'token verification failed')
    //     }
    // }
    req.id = 1;
    req.role = 1;
    next();
};
AuthMiddleware.authorize = (roles) => {
    return (req, res, next) => {
        if (req.id) {
            if (roles === req.role) {
                return next();
            }
            return (0, utils_1.sendResponse)(res, 403, 'permission denied');
        }
        return (0, utils_1.sendResponse)(res, 401, 'token is required');
    };
};
exports.default = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map