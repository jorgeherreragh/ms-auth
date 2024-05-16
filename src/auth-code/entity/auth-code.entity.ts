import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { BaseEntity } from "src/entity/base.entity";
import { User } from "src/users/entity/user.entity";
import { AuthCodeType } from "src/utils/types/auth-code.type";

@Schema()
export class AuthCode extends BaseEntity {
    @Prop({ required: false, unique: false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user?: User;
    @Prop({ unique: false, required: false })
    code?: string;
    @Prop({ unique: false, required: false })
    token?: string;
    @Prop({ unique: false, required: false })
    idToken?: string;
    @Prop({ unique: false, required: false })
    refreshToken?: string;
    @Prop({ required: true })
    type!: string;

    constructor(authCode: AuthCodeType) {
        super();
        Object.assign(this, authCode);
    }

    static get prefix(): string {
        return 'codes/';
    }
}

export const AuthCodeEntity = SchemaFactory.createForClass(AuthCode);