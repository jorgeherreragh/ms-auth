import { UserPermissionType } from "src/user-permission/user-permission.type";

export type UserRoleType = {
    name?: string;
    permissions?: UserPermissionType[];
};