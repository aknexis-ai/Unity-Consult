import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type SettingDocument = HydratedDocument<Setting>;

@Schema({ timestamps: true, versionKey: false })
export class Setting {
  @Prop({ required: true, trim: true, index: true })
  scope!: string;

  @Prop({ required: true, trim: true, index: true })
  ownerId!: string;

  @Prop({ required: true, trim: true })
  key!: string;

  @Prop({ type: Object, required: true })
  value!: Record<string, unknown>;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
SettingSchema.index({ scope: 1, ownerId: 1, key: 1 }, { unique: true });
