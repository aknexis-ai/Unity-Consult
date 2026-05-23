import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type OrderDocument = HydratedDocument<Order>;

export enum OrderLifecycleStatus {
  Inquiry = "inquiry",
  QuoteSent = "quote_sent",
  BookingConfirmed = "booking_confirmed",
  AdvancePaid = "advance_paid",
  InProgress = "in_progress",
  UnderReview = "under_review",
  RevisionRequested = "revision_requested",
  Completed = "completed",
  Cancelled = "cancelled",
  Archived = "archived",
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Order {
  @Prop({ type: String, trim: true, default: null })
  clientId?: string | null;

  @Prop({ required: true, trim: true })
  clientName!: string;

  @Prop({ type: String, trim: true, default: null })
  serviceId?: string | null;

  @Prop({ required: true, trim: true })
  serviceName!: string;

  @Prop({ type: String, trim: true, default: null })
  leadId?: string | null;

  @Prop({ type: Number, min: 0, default: 0 })
  amount!: number;

  @Prop({ trim: true, default: "INR" })
  currency!: string;

  @Prop({ trim: true, default: OrderLifecycleStatus.Inquiry })
  stage!: string;

  @Prop({ type: String, trim: true, default: null })
  owner?: string | null;

  @Prop({ enum: OrderLifecycleStatus, default: OrderLifecycleStatus.Inquiry })
  status!: string;

  @Prop({ type: String, trim: true, default: "pending" })
  paymentStatus!: string;

  @Prop({ type: String, trim: true, default: "advance_payment" })
  paymentMode!: string;

  @Prop({ type: [Object], default: [] })
  paymentMilestones!: Array<{
    milestone_number: number;
    description: string;
    amount: number;
    due_date: Date;
    status: string;
    paid_at?: Date | null;
  }>;

  @Prop({ type: String, trim: true, default: null })
  notes?: string | null;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
