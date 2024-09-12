import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
export class UpdateProfileDao {
    @IsNotEmpty()
    @IsString()
    public name!: string;

    @IsNotEmpty()
    @IsEmail()
    public email!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(0|\+84)[0-9]{9,10}$/, { message: 'phone is invalid' })
    public phone!: string;

    publish!: number;

    constructor(name: string, email: string, phone: string, avatar: string, publish: number) {
        this.publish = publish;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
}
export default UpdateProfileDao;