import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true, versionKey: false })
export class Project {
  @Prop({ type: String, trim: true, default: null })
  orderId?: string | null;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  clientName!: string;

  @Prop({ required: true, lowercase: true, trim: true })
  clientEmail!: string;

  @Prop({ required: true, trim: true })
  serviceName!: string;

  @Prop({ trim: true, default: "active" })
  status!: string;

  @Prop({ trim: true, default: "Discovery" })
  milestone!: string;

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  progress!: number;

  @Prop({ type: Date, default: null })
  dueDate?: Date | null;

  @Prop({ type: [String], default: [] })
  deliverables!: string[];

  @Prop({ type: [String], default: [] })
  milestones!: string[];

  @Prop({ type: [String], default: [] })
  files!: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
