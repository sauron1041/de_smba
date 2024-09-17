import { IsNotEmpty, IsString } from "class-validator";

export class CreateDto {
    id?: number;
    employee_id?: number;
    skill_id?: number;
    created_at?: Date;
    updated_at?: Date;

    constructor(id?: number, employee_id?: number, skill_id?: number, created_at?: Date, updated_at?: Date) {
        this.id = id;
        this.employee_id = employee_id;
        this.skill_id = skill_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}