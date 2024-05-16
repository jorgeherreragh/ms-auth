import { Prop } from "@nestjs/mongoose";

export class BaseEntity {
    @Prop({ required: false })
    createdAt?: string;

    @Prop({ required: false })
    createdBy?: string;

    @Prop({ required: false })
    updatedAt?: string;

    @Prop({ required: false })
    updatedBy?: string;
}