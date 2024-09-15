import { IsNotEmpty, IsString } from "class-validator";

export class CreateDto {
    id?: number;
    service_id?: number;
    skill_id?: number;
    created_at?: Date;
    updated_at?: Date;

    constructor(id?: number, service_id?: number, skill_id?: number, created_at?: Date, updated_at?: Date) {
        this.id = id;
        this.service_id = service_id;
        this.skill_id = skill_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}