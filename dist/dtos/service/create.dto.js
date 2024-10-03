"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDto = void 0;
class CreateDto {
    constructor(id, name, description, price, status, branch_id, total_sessions, user_id, created_at, updated_at, service_package_id) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.status = status;
        this.branch_id = branch_id;
        this.total_sessions = total_sessions;
        this.user_id = user_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.service_package_id = service_package_id;
    }
}
exports.CreateDto = CreateDto;
//# sourceMappingURL=create.dto.js.map