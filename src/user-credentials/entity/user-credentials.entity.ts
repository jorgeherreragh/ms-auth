import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { BaseEntity } from "src/entity/base.entity";
import { User } from "src/users/entity/user.entity";

@Schema()
export class UserCredentials extends BaseEntity {
    @Prop({ required: false, unique: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user?: User;

    @Prop({ unique: true, required: false })
    email?: string;

    @Prop({ unique: true, required: false })
    phoneNumber?: string;

    @Prop({ unique: true, required: false })
    username?: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false })
    confirmPassword: string;
}

export const UserCredentialsEntity = SchemaFactory.createForClass(UserCredentials);