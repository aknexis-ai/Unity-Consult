import { HydratedDocument, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type DocumentRecordDocument = HydratedDocument<DocumentRecord>;

export enum DocumentCategory {
  Contract = "contract",
  Invoice = "invoice",
  Deliverable = "deliverable",
  Identity = "identity",
  Other = "other",
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class DocumentRecord {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ type: String, trim: true, default: null })
  ownerId?: string | null;

  @Prop({ enum: DocumentCategory, default: DocumentCategory.Other })
  category!: DocumentCategory;

  @Prop({ type: String, trim: true, default: null })
  mimeType?: string | null;

  @Prop({ required: true, trim: true })
  fileUrl!: string;

  @Prop({ type: String, trim: true, default: null })
  description?: string | null;

  @Prop({ required: true, trim: true })
  ownerName!: string;

  @Prop({ type: Date, default: Date.now })
  uploadedAt!: Date;

  @Prop({ type: Types.ObjectId, default: null })
  gridFsId?: Types.ObjectId | null;
}

export const DocumentRecordSchema = SchemaFactory.createForClass(DocumentRecord);
