import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { BaseEntity } from "src/entity/base.entity";
import { UserPermissions } from "src/user-permission/entity/user-permission.entity";


@Schema()
export class UserRole extends BaseEntity {
    @Prop({ unique: true, required: true })
    name: string;

    @Prop({ required: false, unique: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserPermissions' }] })
    permissions: UserPermissions[];
}

export const UserRoleEntity = SchemaFactory.createForClass(UserRole);