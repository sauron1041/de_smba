import { IsNotEmpty, IsString } from "class-validator";

export class CreateDto {
    id?: number;
    @IsNotEmpty()
    name?: string;
    description?: string;
    level?: number;
    category?: string;
    status?: number;
    employee_id?: number;
    user_id?: number;
    created_at?: Date;
    updated_at?: Date;

    constructor(id?: number, name?: string, description?: string, level?: number, category?: string, status?: number, employee_id?: number, user_id?: number, created_at?: Date, updated_at?: Date) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.level = level;
        this.category = category;
        this.status = status;
        this.employee_id = employee_id;
        this.user_id = user_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}