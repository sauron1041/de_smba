"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDto = void 0;
class CreateDto {
    constructor(id, customer_id, check_in_time, status, service_id, user_id, created_at, updated_at) {
        this.id = id;
        this.customer_id = customer_id;
        this.check_in_time = check_in_time;
        this.status = status;
        this.service_id = service_id;
        this.user_id = user_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
exports.CreateDto = CreateDto;
//# sourceMappingURL=create.dto.js.map