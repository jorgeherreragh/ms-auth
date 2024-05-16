import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";

export class UpdateUserDto {
    @IsEmail()
    @IsString()
    @IsOptional()
    email?: string;

    @IsPhoneNumber()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    avatarUrl?: string;

    @IsString()
    @IsOptional()
    password?: string;
}