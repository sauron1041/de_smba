"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDto = void 0;
class CreateDto {
    constructor(id, customer_id, employee_id, service_id, status, check_in_time, serving_at, completed_at, updated_at, user_id, branch_id) {
        this.id = id;
        this.customer_id = customer_id;
        this.employee_id = employee_id;
        this.service_id = service_id;
        this.status = status;
        this.check_in_time = check_in_time;
        this.serving_at = serving_at;
        this.completed_at = completed_at;
        this.updated_at = updated_at;
        this.user_id = user_id;
        this.branch_id = branch_id;
    }
}
exports.CreateDto = CreateDto;
//# sourceMappingURL=create.dto.js.map