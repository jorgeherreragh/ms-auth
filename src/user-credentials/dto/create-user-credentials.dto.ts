import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserCredentialsDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    password: string;

    @IsString()
    confirmPassword: string;
}