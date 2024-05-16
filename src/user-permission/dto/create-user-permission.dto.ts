import { IsBoolean, IsOptional } from "class-validator";

export class CreateUserPermissionDto {
    @IsBoolean()
    @IsOptional()
    canEdit?: boolean;
    @IsBoolean()
    @IsOptional()
    canRead?: boolean;
    @IsBoolean()
    @IsOptional()
    canDelete?: boolean;
}