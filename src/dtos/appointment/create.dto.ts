import { IsNotEmpty, IsString } from "class-validator";

export class CreateDto {
    id?: number;
    @IsNotEmpty()
    date?: Date;
    time?: Date;
    status?: number;
    customer_id?: number;
    employee_id?: number | null;
    service_id?: number;
    note?: string;
    reminder_sent?: number;
    branch_id?: number;
    user_id?: number;
    created_at?: Date;
    updated_at?: Date;

    constructor(id?: number, date?: Date, time?: Date, status?: number, customer_id?: number, employee_id?: number, service_id?: number, note?: string, reminder_sent?: number, branch_id?: number, user_id?: number, created_at?: Date, updated_at?: Date) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.status = status;
        this.customer_id = customer_id;
        this.employee_id = employee_id;
        this.service_id = service_id;
        this.note = note;
        this.reminder_sent = reminder_sent;
        this.branch_id = branch_id;
        this.user_id = user_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}