import { IsNotEmpty, IsString } from "class-validator";
export class LoginDto {
    @IsNotEmpty()
    @IsString()
    public username!: string;

    @IsNotEmpty()
    @IsString()
    public password!: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}
export default LoginDto;