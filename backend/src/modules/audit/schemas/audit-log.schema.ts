import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class AuditLog {
  @Prop({ required: true, trim: true })
  action!: string;

  @Prop({ required: true, trim: true })
  entityType!: string;

  @Prop({ type: String, trim: true, default: null })
  entityId?: string | null;

  @Prop({ type: String, trim: true, default: null })
  actorId?: string | null;

  @Prop({ type: String, trim: true, default: null })
  actorRole?: string | null;

  @Prop({ type: Object, default: {} })
  metadata!: Record<string, unknown>;

  createdAt!: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
