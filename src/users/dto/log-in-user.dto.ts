import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class LogInUserDto {
    @IsEmail()
    @IsOptional()
    @IsString()
    email?: string;

    @IsPhoneNumber()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    password: string;

}