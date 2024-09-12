import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class Create {
    id?: number;
    @IsNotEmpty()
    username?: string;
    @IsNotEmpty()
    password?: string;
    name?: string;
    email?: string;
    phone?: string;
    gender?: string;
    loyalty_points?: number;
    avatar?: string;
    status?: boolean;
    role?: number;
    token?: string;
    user_id?: number;
    created_at?: string;
    updated_at?: string;

    constructor(id?: number, username?: string, password?: string, name?: string, email?: string, phone?: string, gender?: string, loyalty_points?: number, avatar?: string, status?: boolean, role?: number, token?: string, user_id?: number, created_at?: string, updated_at?: string) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.gender = gender;
        this.loyalty_points = loyalty_points;
        this.avatar = avatar;
        this.status = status;
        this.role = role;
        this.token = token;
        this.user_id = user_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}