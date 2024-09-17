import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateDto {
    id?: number;
    employee_id?: number;
    is_available?: number;
    created_at?: Date;
    updated_at?: Date;
    branch_id?: number;
    position_id?: number; // 1: admin, 2: reception employee, 3: technican employee
    user_id?: number;

    constructor(id?: number, employee_id?: number, is_available?: number, created_at?: Date, updated_at?: Date, branch_id?: number, position_id?: number, user_id?: number) {
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