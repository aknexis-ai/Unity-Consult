import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type LeadDocument = HydratedDocument<Lead>;

export enum LeadStage {
  New = "new",
  Qualified = "qualified",
  Proposal = "proposal",
  Won = "won",
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Lead {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ type: String, trim: true, default: null })
  phone?: string | null;

  @Prop({ type: String, trim: true, default: null })
  company?: string | null;

  @Prop({ required: true, trim: true })
  service!: string;

  @Prop({ enum: LeadStage, default: LeadStage.New })
  stage!: LeadStage;

  @Prop({ type: String, trim: true, default: null })
  source?: string | null;

  @Prop({ type: String, trim: true, default: null })
  budget?: string | null;

  @Prop({ type: String, trim: true, default: null })
  budgetRange?: string | null;

  @Prop({ type: String, trim: true, default: null })
  inquiryType?: string | null;

  @Prop({ type: String, trim: true, default: null })
  serviceInterest?: string | null;

  @Prop({ type: String, trim: true, default: null })
  message?: string | null;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
