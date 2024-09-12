import { IsNotEmpty, IsString } from "class-validator";
export class ChangePasswordDto {
    public username!: string;

    @IsNotEmpty()
    @IsString()
    public password!: string;

    @IsNotEmpty()
    @IsString()
    public newPassword!: string;

    id?: number;

    constructor(username: string, password: string, newPassword: string, id?: number) {
        this.username = username;
        this.password = password;
        this.newPassword = newPassword;
        this.id = id;
    }
}
export default ChangePasswordDto