import { IsNotEmpty, IsString } from "class-validator";

export class CreateDto {
    id?: number;
    @IsNotEmpty()
    name?: string;
    service_id?: number;
    customer_id?: number;
    staff_id?: number;
    status?: number;
    user_id?: number;
    created_at?: Date;
    updated_at?: Date;

    constructor(id?: number, name?: string, service_id?: number, customer_id?: number, staff_id?: number, status?: number, user_id?: number, created_at?: Date, updated_at?: Date) {
        this.id = id;
        this.name = name;
        this.service_id = service_id;
        this.customer_id = customer_id;
        this.staff_id = staff_id;
        this.status = status;
        this.user_id = user_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}