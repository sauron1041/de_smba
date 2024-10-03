"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(status, message, field) {
        super(message);
        this.status = status;
        this.message = message;
        this.field = field;
        Object.setPrototypeOf(this, HttpException.prototype);
    }
    getResponse() {
        return {
            status: this.status,
            error: {
                field: this.field,
                message: this.message
            }
        };
    }
}
exports.default = HttpException;
//# sourceMappingURL=http.exception.js.map