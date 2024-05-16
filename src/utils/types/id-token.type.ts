import { UserCredentialsType } from "src/user-credentials/user-credentials.type";
import { UserRoleType } from "src/user-role/user-role.type";
import { UserType } from "src/users/user.type";

export type IdTokenDataType = UserType & {
    credentials: UserCredentialsType;
    role: UserRoleType;
};