import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Gender } from '@prisma/client';
import { HydratedDocument } from 'mongoose';

export type StylistDocument = HydratedDocument<Stylist>;

@Schema()
export class Stylist extends Document {
    @Prop({ unique: true, required: true })
    full_name: string;

    @Prop()
    experience: string;

    @Prop()
    avatar: string;

    @Prop()
    rating: number;

    @Prop({ unique: true, required: true })
    phone_number: string;

    @Prop({ unique: true, required: true })
    email: string;

    @Prop()
    work_schedule: string;

    @Prop()
    position: string;

    @Prop({ enum: Gender, required: false })
    gender: Gender;

    @Prop({ required: true })
    isActive: boolean;
}

export const StylistSchema = SchemaFactory.createForClass(Stylist);
