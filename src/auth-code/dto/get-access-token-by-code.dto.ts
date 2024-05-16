import { IsIn, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";
import { GrantType } from "src/utils/enums/grant-type.enum";

export class GetAccessTokenByCodeDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(Object.values(GrantType))
    grant_type!: string;

    @ValidateIf(({ grant_type }) => grant_type === GrantType.ACCESS)
    @IsNotEmpty()
    @IsString()
    code?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    refresh_token?: string;

    @IsOptional()
    redirect_uri?: string;

    @IsOptional()
    client_id?: string;

    @IsString()
    user_id: string;
}