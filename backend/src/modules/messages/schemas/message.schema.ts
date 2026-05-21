import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true, versionKey: false })
export class Message {
  @Prop({ required: true, trim: true })
  fromName!: string;

  @Prop({ type: String, trim: true, default: null })
  toName?: string | null;

  @Prop({ type: String, trim: true, default: null })
  toUserId?: string | null;

  @Prop({ required: true, trim: true })
  role!: string;

  @Prop({ trim: true, default: "portal" })
  channel!: string;

  @Prop({ required: true, trim: true })
  message!: string;

  @Prop({ type: String, trim: true, default: null })
  projectId?: string | null;

  @Prop({ type: Date, default: null })
  readAt?: Date | null;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
