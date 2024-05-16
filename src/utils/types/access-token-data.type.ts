import { UserRole } from "src/user-role/entity/user-role.entity";
import { AuthenticationMethodType } from "../enums/authentication-method.enum";
import { TokenTypeEnum } from "../enums/token.enum";

export type AccessTokenDataType = {
    type: TokenTypeEnum;
    role: UserRole;
    firstName?: string;
    authenticationMethod?: AuthenticationMethodType;
    email?: string;
    phoneNumber?: string;
    userName?: string;
};