import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { BaseEntity } from "src/entity/base.entity";
import { User } from "src/users/entity/user.entity";

@Schema()
export class UserPermissions extends BaseEntity {
    @Prop({ required: true })
    canEdit?: boolean;

    @Prop({ required: true })
    canRead?: boolean;

    @Prop({ required: true })
    canDelete?: boolean;
}

export const UserPermissionsEntity = SchemaFactory.createForClass(UserPermissions);