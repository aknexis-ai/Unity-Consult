import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type TeamMemberDocument = HydratedDocument<TeamMember>;

@Schema({ timestamps: true, versionKey: false })
export class TeamMember {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, lowercase: true, trim: true, unique: true })
  email!: string;

  @Prop({ required: true, trim: true })
  role!: string;

  @Prop({ required: true, trim: true })
  focus!: string;

  @Prop({ trim: true, default: "active" })
  status!: string;

  @Prop({ type: [String], default: [] })
  permissions!: string[];
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);
