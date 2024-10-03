import { IsNotEmpty, IsString } from "class-validator";

export class CreateDto {
    id?: number;
    name?: string;
    status?: boolean;
    address?: string;
    phone?: string;
    email?: string;
    created_at?: Date;
    updated_at?: Date;

    constructor(id?: number, name?: string, status?: boolean, address?: string, phone?: string, email?: string, created_at?: Date, updated_at?: Date) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}