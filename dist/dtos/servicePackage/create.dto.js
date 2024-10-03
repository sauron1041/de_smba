"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDto = void 0;
class CreateDto {
    constructor(id, name, description, price, status, branch_id, total_sessions, user_id, created_at, updated_at) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.user_id = user_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
exports.CreateDto = CreateDto;
//# sourceMappingURL=create.dto.js.map