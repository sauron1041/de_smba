import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateDto {
    id?: number;
    customer_id?: number;
    check_in_time?: Date;
    status?: number;
    service_id?: number;
    user_id?: number;
    created_at?: Date;
    updated_at?: Date;

    constructor(id?: number, customer_id?: number, check_in_time?: Date, status?: number, service_id?: number, user_id?: number, created_at?: Date, updated_at?: Date) {
        this.id = id;
        this.customer_id = customer_id;
        this.check_in_time = check_in_time;
        this.status = status;
        this.service_id = service_id;
        this.user_id = user_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}