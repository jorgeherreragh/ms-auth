import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";
import { CreateUserPermissionDto } from "src/user-permission/dto/create-user-permission.dto";

export class CreateUserRoleDto {
    @IsString()
    name: string;

    @IsArray()
    @IsString({ each: true })
    permissions: string[];
}