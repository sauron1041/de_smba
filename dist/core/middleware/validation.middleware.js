"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("@core/exceptions");
const utils_1 = require("@core/utils");
const utils_2 = require("@core/utils");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const errorMiddleware = (type, location = 'body', skipMissingProperties = false) => {
    return (req, res, next) => {
        let data;
        switch (location) {
            case 'body':
                data = req.body;
                break;
            case 'params':
                data = req.params;
                break;
            case 'query':
                data = req.query;
                break;
            default:
                return next(new exceptions_1.HttpException(400, 'invalid location'));
        }
        if (!data) {
            return next(new exceptions_1.HttpException(400, `${location} is missing`));
        }
        const dtoInstance = (0, class_transformer_1.plainToClass)(type, data);
        (0, class_validator_1.validate)(dtoInstance, { skipMissingProperties }).then((errors) => {
            if (errors.length > 0) {
                utils_2.Logger.error('Validation errors:', errors);
                const message = errors[0].constraints ? errors[0].constraints[Object.keys(errors[0].constraints)[0]] : 'invalid data';
                (0, utils_1.sendResponse)(res, 400, message, null, errors[0].property);
            }
            else {
                next();
            }
        }).catch((error) => {
            utils_2.Logger.error('Error Middleware:', error);
            return (0, utils_1.sendResponse)(res, 500, 'server error');
        });
    };
};
exports.default = errorMiddleware;
//# sourceMappingURL=validation.middleware.js.map