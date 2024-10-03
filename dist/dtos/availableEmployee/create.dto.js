"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDto = void 0;
class CreateDto {
    constructor(id, employee_id, is_available, created_at, updated_at, branch_id, position_id, user_id) {
        this.id = id;
        this.employee_id = employee_id;
        this.is_available = is_available;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.branch_id = branch_id;
        this.position_id = position_id;
        this.user_id = user_id;
    }
}
exports.CreateDto = CreateDto;
//# sourceMappingURL=create.dto.js.map