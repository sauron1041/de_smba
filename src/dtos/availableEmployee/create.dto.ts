import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateDto {
    id?: number;
    employee_id?: number;
    is_available?: number;
    created_at?: Date;
    updated_at?: Date;

    constructor(id?: number, employee_id?: number, is_available?: number, created_at?: Date, updated_at?: Date) {
        this.id = id;
        this.employee_id = employee_id;
        this.is_available = is_available;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}