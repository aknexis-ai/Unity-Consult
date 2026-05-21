import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type TicketDocument = HydratedDocument<Ticket>;

export enum TicketPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
  Urgent = "urgent",
}

export enum TicketStatus {
  Open = "open",
  InProgress = "in_progress",
  Waiting = "waiting",
  Resolved = "resolved",
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Ticket {
  @Prop({ required: true, trim: true })
  subject!: string;

  @Prop({ required: true, trim: true })
  message!: string;

  @Prop({ required: true, trim: true })
  requesterName!: string;

  @Prop({ required: true, lowercase: true, trim: true })
  requesterEmail!: string;

  @Prop({ enum: TicketPriority, default: TicketPriority.Medium })
  priority!: TicketPriority;

  @Prop({ enum: TicketStatus, default: TicketStatus.Open })
  status!: TicketStatus;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
