import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateDto {
    id?: number;
    customer_id?: number;
    employee_id?: number | null;
    service_id?: number;
    status?: number;
    check_in_time?: Date;
    serving_at?: Date;
    completed_at?: Date;
    updated_at?: Date;
    user_id?: number;
    branch_id?: number;


    constructor(id?: number, customer_id?: number, employee_id?: number, service_id?: number, status?: number, check_in_time?: Date, serving_at?: Date, completed_at?: Date, updated_at?: Date, user_id?: number, branch_id?: number) {
        this.id = id;
        this.customer_id = customer_id;
        this.employee_id = employee_id;
        this.service_id = service_id;
        this.status = status;
        this.check_in_time = check_in_time;
        this.serving_at = serving_at;
        this.completed_at = completed_at;
        this.updated_at = updated_at;
        this.user_id = user_id;
        this.branch_id = branch_id;
    }
}