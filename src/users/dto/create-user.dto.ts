import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, ValidateNested } from "class-validator";
import { CreateUserCredentialsDto } from "src/user-credentials/dto/create-user-credentials.dto";
import { CreateUserRoleDto } from "src/user-role/dto/create-user-role.dto";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    avatarUrl?: string;

    @ValidateNested()
    @Type(() => CreateUserCredentialsDto)
    credentials: CreateUserCredentialsDto;

    @IsString()
    role: string;
}