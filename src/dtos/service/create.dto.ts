import { IsNotEmpty, IsString } from "class-validator";

export class CreateDto {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    status?: boolean;
    branch_id?: number;
    total_sessions?: number;
    user_id?: number;
    created_at?: Date;
    updated_at?: Date;
    service_package_id?: number;

    constructor(id?: number, name?: string, description?: string, price?: number, status?: boolean, branch_id?: number, total_sessions?: number, user_id?: number, created_at?: Date, updated_at?: Date, service_package_id?: number) {
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