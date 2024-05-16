import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseEntity } from "../../entity/base.entity";
import mongoose from "mongoose";
import { UserCredentials } from "src/user-credentials/entity/user-credentials.entity";
import { UserRole } from "src/user-role/entity/user-role.entity";
import { IdTokenDataType } from "src/utils/types/id-token.type";

@Schema()
export class User extends BaseEntity {

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: false })
    lastName?: string;

    @Prop({ required: false })
    avatarUrl?: string;

    @Prop({ required: true, unique: true, type: mongoose.Schema.Types.ObjectId, ref: 'UserCredentials' })
    credentials: UserCredentials;

    @Prop({ required: true, unique: true, type: mongoose.Schema.Types.ObjectId, ref: 'UserRole' })
    role: UserRole;

    getUserRole(): UserRole {
        return this.role;
    }


    getUserProfile(): IdTokenDataType {
        const userProfile: IdTokenDataType = {
            role: this.getUserRole(),
            firstName: this.firstName || '',
            lastName: this.lastName || '',
            credentials: this.credentials || {},
        };

        return userProfile;
    }

}

export const UserEntity = SchemaFactory.createForClass(User);