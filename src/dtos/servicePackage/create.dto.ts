import { IsNotEmpty, IsString } from "class-validator";

export class CreateDto {
    id?: number;
    name?: string;
    status?: boolean;
    user_id?: number;
    created_at?: Date;
    updated_at?: Date;

    constructor(id?: number, name?: string, description?: string, price?: number, status?: boolean, branch_id?: number, total_sessions?: number, user_id?: number, created_at?: Date, updated_at?: Date) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.user_id = user_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}