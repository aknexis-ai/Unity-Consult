import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type InvoiceDocument = HydratedDocument<Invoice>;

export enum InvoiceStatus {
  Draft = "draft",
  Issued = "issued",
  PartiallyPaid = "partially_paid",
  Paid = "paid",
  Overdue = "overdue",
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Invoice {
  @Prop({ type: String, trim: true, default: null })
  orderId?: string | null;

  @Prop({ required: true, trim: true })
  invoiceNumber!: string;

  @Prop({ required: true, trim: true })
  clientName!: string;

  @Prop({ required: true, lowercase: true, trim: true })
  clientEmail!: string;

  @Prop({ required: true, trim: true })
  serviceName!: string;

  @Prop({ required: true, min: 0 })
  amount!: number;

  @Prop({ required: true, min: 0, default: 0 })
  amountPaid!: number;

  @Prop({ enum: InvoiceStatus, default: InvoiceStatus.Draft })
  status!: InvoiceStatus;

  @Prop({ type: Date, default: null })
  dueDate?: Date | null;

  @Prop({ type: Date, default: null })
  paidAt?: Date | null;

  @Prop({ type: String, trim: true, default: null })
  providerOrderId?: string | null;

  @Prop({ type: String, trim: true, default: null })
  providerPaymentId?: string | null;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
