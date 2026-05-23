import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ContentItemDocument = HydratedDocument<ContentItem>;

@Schema({ timestamps: true, versionKey: false })
export class ContentItem {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, trim: true })
  type!: string;

  @Prop({ required: true, trim: true })
  status!: string;

  @Prop({ type: String, trim: true, default: null })
  summary?: string | null;

  @Prop({ type: String, default: null })
  imageId?: string | null;

  @Prop({ type: String, default: null })
  imageUrl?: string | null;
}

export const ContentItemSchema = SchemaFactory.createForClass(ContentItem);
