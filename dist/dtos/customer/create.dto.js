"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDto = void 0;
const class_validator_1 = require("class-validator");
class CreateDto {
    constructor(id, username, password, name, email, phone, gender, loyalty_points, avatar, status, role, token, user_id, created_at, updated_at) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.gender = gender;
        this.loyalty_points = loyalty_points;
        this.avatar = avatar;
        this.status = status;
        this.role = role;
        this.token = token;
        this.user_id = user_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
exports.CreateDto = CreateDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], CreateDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], CreateDto.prototype, "password", void 0);
//# sourceMappingURL=create.dto.js.map