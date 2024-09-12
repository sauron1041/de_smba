import { IsNotEmpty, IsString } from "class-validator";

export class CreateDto {
    id?: number;
    @IsNotEmpty()
    customer_id?: number;
    session_id?: string;
    process?: string;
    note?: string;
    branch_id?: number;
    status?: boolean;
    user_id?: number;
    created_at?: Date;
    updated_at?: Date;

    constructor(id?: number, customer_id?: number, session_id?: string, process?: string, note?: string, branch_id?: number, status?: boolean, user_id?: number, created_at?: Date, updated_at?: Date) {
        this.id = id;
        this.customer_id = customer_id;
        this.session_id = session_id;
        this.process = process;
        this.note = note;
        this.branch_id = branch_id;
        this.status = status;
        this.user_id = user_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}